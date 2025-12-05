import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/postgresClient";
import { IS_PROD, NODES_API_URL } from "@/lib/config";
import { analyticsQuerySchema, intervalToDateTrunc } from "@/lib/schema";
import { cookies } from "next/headers";
import { formatDate } from "date-fns";

// Helper function to escape CSV values
function escapeCsvValue(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = String(value);
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { from, to, interval } = analyticsQuerySchema.parse(
      Object.fromEntries(searchParams)
    );

    const client = await pool.connect();

    // Query to get all analytics data aggregated by interval
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
          ${
            IS_PROD
              ? "username NOT LIKE '%@desci.com' AND host_name IN ('www.sciweave.com', 'legacy.sciweave.com', 'xqttmvkzpjfhelao4a7cbsw22a0gzbpg.lambda-url.us-east-2.on.aws') AND"
              : ""
          }
          created_at >= $1
          AND created_at <= $2
      ),
      period_data AS (
        SELECT
          DATE_TRUNC($3, created_at) AS period_date,
          COUNT(*) FILTER (WHERE thread_id IS NULL OR thread_id = id) AS total_chats,
          COUNT(DISTINCT username) FILTER (WHERE thread_id IS NULL OR thread_id = id) AS unique_users,
          COUNT(*) FILTER (WHERE thread_id IS NOT NULL AND thread_id != id) AS followup_chats
        FROM base_logs
        GROUP BY period_date
      ),
      sessionized AS (
        SELECT
          *,
          CASE
            WHEN EXTRACT(
              EPOCH
              FROM
                (
                  created_at - LAG(created_at) OVER (
                    PARTITION BY username
                    ORDER BY created_at
                  )
                )
            ) > 1800
            OR LAG(created_at) OVER (
              PARTITION BY username
              ORDER BY created_at
            ) IS NULL THEN 1
            ELSE 0
          END AS new_session_flag
        FROM base_logs
      ),
      session_ids AS (
        SELECT
          *,
          SUM(new_session_flag) OVER (
            PARTITION BY username
            ORDER BY created_at
          ) AS session_id
        FROM sessionized
      ),
      session_bounds AS (
        SELECT
          username,
          session_id,
          DATE_TRUNC($3, MIN(created_at)) AS session_period,
          EXTRACT(
            EPOCH
            FROM
              MAX(created_at) - MIN(created_at)
          ) AS session_duration_sec
        FROM session_ids
        GROUP BY username, session_id
      ),
      session_stats AS (
        SELECT
          session_period AS period_date,
          COUNT(*)::integer AS session_count,
          ROUND(AVG(session_duration_sec), 2)::numeric AS avg_duration_seconds
        FROM session_bounds
        WHERE session_duration_sec > 0
        GROUP BY session_period
      )
      SELECT
        pd.period_date,
        COALESCE(pd.total_chats, 0)::integer AS total_chats,
        COALESCE(pd.unique_users, 0)::integer AS unique_users,
        COALESCE(pd.followup_chats, 0)::integer AS followup_chats,
        COALESCE(ss.session_count, 0)::integer AS session_count,
        COALESCE(ss.avg_duration_seconds, 0)::numeric AS avg_duration_seconds
      FROM period_data pd
      LEFT JOIN session_stats ss ON pd.period_date = ss.period_date
      ORDER BY pd.period_date
      `,
      [from, to, intervalToDateTrunc(interval)]
    );

    client.release();

    // Fetch new users data from the API
    let newUsersData: { date: string; value: number }[] = [];
    try {
      const newUsersResponse = await fetch(
        `${NODES_API_URL}/v1/admin/analytics/new-sciweave-users?from=${from.toISOString()}&to=${to.toISOString()}&interval=${interval}`,
        {
          credentials: "include",
          headers: {
            cookie: cookies().toString(),
            "Content-Type": "application/json",
          },
        }
      );

      if (newUsersResponse.ok) {
        const newUsersResult = await newUsersResponse.json();
        newUsersData = newUsersResult?.data?.analytics || [];
      }
    } catch (error) {
      console.error("Error fetching new users data:", error);
      // Continue without new users data if API call fails
    }

    // Create a map of new users by period date for easy lookup
    // Match dates by truncating to the same interval as the query
    const newUsersMap = new Map<string, number>();
    newUsersData.forEach((item) => {
      const itemDate = new Date(item.date);
      let dateKey: string;

      if (interval === "monthly") {
        // Match by year-month
        dateKey = `${itemDate.getFullYear()}-${String(
          itemDate.getMonth() + 1
        ).padStart(2, "0")}`;
      } else if (interval === "weekly") {
        // Match by week start (Sunday)
        const weekStart = new Date(itemDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        dateKey = weekStart.toISOString().split("T")[0];
      } else {
        // Match by day
        dateKey = itemDate.toISOString().split("T")[0];
      }

      // If key already exists, sum the values (in case of duplicates)
      const existingValue = newUsersMap.get(dateKey) || 0;
      newUsersMap.set(dateKey, existingValue + item.value);
    });

    // Define columns based on interval
    const dateColumn =
      interval === "monthly"
        ? "month"
        : interval === "weekly"
        ? "week"
        : "date";
    const yearColumn =
      interval === "monthly" ? "year" : interval === "weekly" ? "year" : null;

    // Set up headers
    const headers = [
      dateColumn,
      ...(yearColumn ? [yearColumn] : []),
      "totalChats",
      "activeUsers",
      "newUsers",
      "followupChats",
      "sessionCount",
      "avgDurationSeconds",
    ];

    // Build CSV content
    const csvRows: string[] = [];

    // Add header row
    csvRows.push(headers.map(escapeCsvValue).join(","));

    // Add data rows
    result.rows.forEach((row: any) => {
      const periodDate = new Date(row.period_date);
      const rowData: any[] = [];

      if (interval === "monthly") {
        rowData.push(periodDate.getMonth() + 1);
        rowData.push(periodDate.getFullYear());
      } else if (interval === "weekly") {
        // Get the week start date (Sunday)
        const weekStart = new Date(periodDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        rowData.push(weekStart.toISOString().split("T")[0]);
        rowData.push(periodDate.getFullYear());
      } else {
        rowData.push(periodDate.toISOString().split("T")[0]);
      }

      rowData.push(row.total_chats);
      rowData.push(row.unique_users);

      // Match new users data by period date
      let periodDateKey: string;
      if (interval === "monthly") {
        periodDateKey = `${periodDate.getFullYear()}-${String(
          periodDate.getMonth() + 1
        ).padStart(2, "0")}`;
      } else if (interval === "weekly") {
        const weekStart = new Date(periodDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        periodDateKey = weekStart.toISOString().split("T")[0];
      } else {
        periodDateKey = periodDate.toISOString().split("T")[0];
      }
      rowData.push(newUsersMap.get(periodDateKey) || 0);

      rowData.push(row.followup_chats);
      rowData.push(row.session_count);
      rowData.push(Number(row.avg_duration_seconds));

      csvRows.push(rowData.map(escapeCsvValue).join(","));
    });

    // Generate CSV string
    const csvContent = csvRows.join("\n");

    // Return as CSV file
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="sciweave-analytics-${interval}-${formatDate(
          from,
          "dd-MM-yyyy"
        )}-to-${formatDate(to, "dd-MM-yyyy")}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting sciweave analytics:", error);
    return NextResponse.json(
      { error: "Failed to export sciweave analytics" },
      { status: 500 }
    );
  }
}
