import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/postgresClient";
import { PROD_FILTER_AND } from "@/lib/config";
import { analyticsQuerySchema } from "@/lib/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { from, to } = analyticsQuerySchema.parse(
      Object.fromEntries(searchParams)
    );

    const client = await pool.connect();

    // Query to get all the metrics in one go
    // Initial chats: thread_id IS NULL OR thread_id = id
    // Follow-up chats: thread_id IS NOT NULL AND thread_id != id
    const result = await client.query(
      `
      WITH base_logs AS (
        SELECT
          id,
          username,
          thread_id,
          created_at
        FROM
          public.search_logs
        WHERE
          created_at >= $1
          AND created_at <= $2
          ${PROD_FILTER_AND}
      ),
      initial_chats AS (
        SELECT COUNT(*) as total_chats
        FROM base_logs
        WHERE thread_id IS NULL OR thread_id = id
      ),
      unique_users AS (
        SELECT COUNT(DISTINCT username) as total_users
        FROM base_logs
      ),
      users_with_followups AS (
        SELECT COUNT(DISTINCT username) as users_with_followups
        FROM base_logs
        WHERE username IN (
          SELECT DISTINCT username
          FROM base_logs
          WHERE thread_id IS NULL OR thread_id = id
        )
        AND thread_id IS NOT NULL
        AND thread_id != id
      ),
      error_stats AS (
        SELECT
          count(*) FILTER (WHERE was_canceled = true) AS canceled_count,
          count(*) FILTER (WHERE response_data = '{}'::jsonb) AS empty_object_count,
          count(*) FILTER (WHERE (response_data ->> 'answer') = '') AS empty_answer_count,
          count(*) FILTER (
            WHERE response_data = '{}'::jsonb
               OR (response_data ->> 'answer') = ''
          ) AS empty_response_count,
          count(*) AS total_questions_count,
          ROUND(
            100.0 * (count(*) FILTER (
              WHERE response_data = '{}'::jsonb
                 OR (response_data ->> 'answer') = ''
            )::numeric) / NULLIF(count(*), 0),
            2
          ) AS error_rate_percent
        FROM public.search_logs
        WHERE created_at >= $1
          AND created_at <= $2
          ${PROD_FILTER_AND}
      )
      SELECT
        (SELECT total_chats FROM initial_chats)::integer as total_chats,
        (SELECT total_users FROM unique_users)::integer as total_users,
        (SELECT users_with_followups FROM users_with_followups)::integer as users_with_followups,
        (SELECT canceled_count FROM error_stats)::integer as canceled_count,
        (SELECT empty_object_count FROM error_stats)::integer as empty_object_count,
        (SELECT empty_answer_count FROM error_stats)::integer as empty_answer_count,
        (SELECT empty_response_count FROM error_stats)::integer as empty_response_count,
        (SELECT total_questions_count FROM error_stats)::integer as total_questions_count,
        (SELECT error_rate_percent FROM error_stats)::numeric as error_rate_percent
      `,
      [from, to]
    );

    client.release();

    const row = result.rows[0];
    const totalChats = row.total_chats || 0;
    const totalUsers = row.total_users || 0;
    const usersWithFollowups = row.users_with_followups || 0;
    const errorRate = Number(row.error_rate_percent) || 0;
    const totalQuestions = row.total_questions_count || 0;
    const emptyResponses = row.empty_response_count || 0;

    // Calculate percentage of users who write follow-up questions
    const followupPercentage =
      totalUsers > 0 ? (usersWithFollowups / totalUsers) * 100 : 0;

    // Calculate average number of chats per user
    const avgChatsPerUser = totalUsers > 0 ? totalChats / totalUsers : 0;

    return NextResponse.json({
      totalChats,
      activeUsers: totalUsers, // Unique users who started a new chat
      followupPercentage: Math.round(followupPercentage * 100) / 100, // Round to 2 decimal places
      avgChatsPerUser: Math.round(avgChatsPerUser * 100) / 100, // Round to 2 decimal places
      errorRate: Math.round(errorRate * 100) / 100, // Round to 2 decimal places
      totalQuestions,
      emptyResponses,
    });
  } catch (error: any) {
    console.error("Error fetching engagement stats:", error);
    if (error?.message?.includes("statement timeout") || error?.message?.includes("query_timeout")) {
      return NextResponse.json(
        { error: "Query timed out. Try a shorter date range." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch engagement stats" },
      { status: 500 }
    );
  }
}
