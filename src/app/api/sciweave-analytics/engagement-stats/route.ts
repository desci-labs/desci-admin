import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import pool from "@/lib/postgresClient";
import { IS_PROD } from "@/lib/config";

const querySchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { from, to } = querySchema.parse(Object.fromEntries(searchParams));

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
          ${IS_PROD ? "AND username NOT LIKE '%@desci.com'" : ""}
      ),
      initial_chats AS (
        SELECT COUNT(*) as total_chats
        FROM base_logs
        WHERE thread_id IS NULL OR thread_id = id
      ),
      unique_users AS (
        SELECT COUNT(DISTINCT username) as total_users
        FROM base_logs
        WHERE thread_id IS NULL OR thread_id = id
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
      )
      SELECT
        (SELECT total_chats FROM initial_chats)::integer as total_chats,
        (SELECT total_users FROM unique_users)::integer as total_users,
        (SELECT users_with_followups FROM users_with_followups)::integer as users_with_followups
      `,
      [from, to]
    );

    client.release();

    const row = result.rows[0];
    const totalChats = row.total_chats || 0;
    const totalUsers = row.total_users || 0;
    const usersWithFollowups = row.users_with_followups || 0;

    // Calculate percentage of users who write follow-up questions
    const followupPercentage =
      totalUsers > 0 ? (usersWithFollowups / totalUsers) * 100 : 0;

    // Calculate average number of chats per user
    const avgChatsPerUser = totalUsers > 0 ? totalChats / totalUsers : 0;

    return NextResponse.json({
      totalChats,
      followupPercentage: Math.round(followupPercentage * 100) / 100, // Round to 2 decimal places
      avgChatsPerUser: Math.round(avgChatsPerUser * 100) / 100, // Round to 2 decimal places
    });
  } catch (error) {
    console.error("Error fetching engagement stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch engagement stats" },
      { status: 500 }
    );
  }
}
