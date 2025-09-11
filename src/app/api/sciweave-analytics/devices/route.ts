import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import pool from "@/lib/postgresClient";
import { IS_PROD } from "@/lib/config";

const querySchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  interval: z.enum(["day", "week", "month"]),
});

async function handleRequest(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { from, to, interval } = querySchema.parse(
      Object.fromEntries(searchParams)
    );

    const client = await pool.connect();
    const result = await client.query(
      `
      SELECT
        date_trunc($3, created_at) AS DATE,
        SUM(((device_info->>'isMobile')::boolean)::int) AS "mobile",
        SUM(((device_info->>'isTablet')::boolean)::int) AS "tablet",
        SUM(((device_info->>'isDesktop')::boolean AND device_info->>'osName' ILIKE 'mac%')::int) AS "mac",
        SUM(((device_info->>'isDesktop')::boolean AND device_info->>'osName' ILIKE 'windows%')::int) AS "windows",
        SUM(((device_info->>'isDesktop')::boolean AND device_info->>'osName' NOT ILIKE 'mac%' AND device_info->>'osName' NOT ILIKE 'windows%')::int) AS "otherDesktops",
        SUM((NOT((device_info->>'isMobile')::boolean OR (device_info->>'isTablet')::boolean OR (device_info->>'isDesktop')::boolean))::int) AS "unknown"
        FROM search_logs
        WHERE created_at >= $1
        AND created_at < $2
        ${IS_PROD ? "AND username NOT LIKE '%@desci.com'" : ""}
        GROUP BY DATE
        ORDER BY DATE;
      `,
      [from, to, interval]
    );
    client.release();
    const data = result.rows as {
      date: Date;
      mobile: number;
      tablet: number;
      mac: number;
      windows: number;
      otherDesktops: number;
      unknown: number;
    }[];

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
