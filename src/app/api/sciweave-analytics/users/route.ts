import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/postgresClient";
import { IS_PROD } from "@/lib/config";
import { analyticsQuerySchema, intervalToDateTrunc } from "@/lib/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { from, to, interval } = analyticsQuerySchema.parse(
      Object.fromEntries(searchParams)
    );

    const client = await pool.connect();
    const result = await client.query(
      `
     SELECT
        DATE_TRUNC($3, created_at) AS DATE,
        COUNT(DISTINCT username) AS value
    FROM
        public.search_logs
    WHERE
        (thread_id IS NULL OR thread_id = id)
        AND created_at >= $1
        AND created_at <= $2
        ${
          IS_PROD
            ? "AND username NOT LIKE '%@desci.com' AND host_name IN ('www.sciweave.com', 'legacy.sciweave.com', 'xqttmvkzpjfhelao4a7cbsw22a0gzbpg.lambda-url.us-east-2.on.aws')"
            : ""
        }
    GROUP BY
        DATE
    ORDER BY
        DATE
      `,
      [from, to, intervalToDateTrunc(interval)]
    );
    client.release();
    const data = result.rows as { day: string; value: number }[];
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching chats over time:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats over time" },
      { status: 500 }
    );
  }
}
