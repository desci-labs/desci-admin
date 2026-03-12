import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/postgresClient";
import { PROD_FILTER_AND } from "@/lib/config";
import { analyticsQuerySchema, intervalToDateTrunc } from "@/lib/schema";

async function handleRequest(request: NextRequest) {
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
        COUNT(*) AS value
    FROM
        public.search_logs
    WHERE
        (thread_id IS NULL OR thread_id = id)
        AND created_at >= $1
        AND created_at <= $2
        ${PROD_FILTER_AND}
    GROUP BY
        DATE
    ORDER BY
        DATE
      `,
      [from, to, intervalToDateTrunc(interval)]
    );
    client.release();
    console.log("Chats", { from, to, interval });
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

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isGet = searchParams.get("get") === "true";
  
  if (isGet) {
    return handleRequest(request);
  }
  
  return NextResponse.json(
    { error: "POST method requires ?get=true parameter for replica compatibility" },
    { status: 400 }
  );
}
