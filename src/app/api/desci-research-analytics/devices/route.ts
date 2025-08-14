import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import pool from "@/lib/postgresClient";

const querySchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  interval: z.enum(["day", "week", "month"]),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { from, to, interval } = querySchema.parse(
      Object.fromEntries(searchParams)
    );
    console.log({
      from,
      to,
      interval,
    });

    const client = await pool.connect();
    const result = await client.query(
      `
      SELECT
            date_trunc($3, created_at) AS DATE,
            COUNT(
            CASE
                WHEN (device_info ->> 'isMobile') :: boolean THEN 1
            END
        ) AS "mobile",
        COUNT(
            CASE
                WHEN (device_info ->> 'isTablet') :: boolean THEN 1
            END
        ) AS "tablet",
        COUNT(
            CASE
                WHEN (device_info ->> 'isDesktop') :: boolean
                AND device_info ->> 'osName' ILIKE 'mac%' THEN 1
            END
        ) AS "mac",
        COUNT(
            CASE
                WHEN (device_info ->> 'isDesktop') :: boolean
                AND device_info ->> 'osName' ILIKE 'windows%' THEN 1
            END
        ) AS "windows",
        COUNT(
            CASE
                WHEN (device_info ->> 'isDesktop') :: boolean
                AND device_info ->> 'osName' NOT ILIKE 'mac%'
                AND device_info ->> 'osName' NOT ILIKE 'windows%' THEN 1
            END
        ) AS "otherDesktops",
        COUNT(
            CASE
                WHEN NOT (
                    (device_info ->> 'isMobile') :: boolean
                    OR (device_info ->> 'isTablet') :: boolean
                    OR (device_info ->> 'isDesktop') :: boolean
                ) THEN 1
            END
        ) AS unknown
        FROM search_logs
        WHERE created_at >= $1
        AND created_at <= $2
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
