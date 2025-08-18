import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import pool from "@/lib/postgresClient";
import { IS_PROD } from "@/lib/config";

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

    const client = await pool.connect();
    const result = await client.query(
      `
      WITH excluded AS (
          SELECT
              UNNEST(
                  ARRAY [
      
          'user_sina@desci.com',

          'user_esther@desci.com',

          'user_sina.iman@gmail.com'
        ]
              ) AS username
      ),
      filtered_logs AS (
          SELECT
              *
          FROM
              search_logs
          WHERE
              username NOT IN (
                  SELECT
                      username
                  FROM
                      excluded
              )
              ${IS_PROD ? "AND username NOT LIKE '%@desci.com'" : ""}
              AND created_at >= $1
              AND created_at <= $2
          ORDER BY
              username,
              created_at
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
                                  ORDER BY
                                      created_at
                              )
                          )
                  ) > 1800
                  OR LAG(created_at) OVER (
                      PARTITION BY username
                      ORDER BY
                          created_at
                  ) IS NULL THEN 1
                  ELSE 0
              END AS new_session_flag
          FROM
              filtered_logs
      ),
      session_ids AS (
          SELECT
              *,
              SUM(new_session_flag) OVER (
                  PARTITION BY username
                  ORDER BY
                      created_at
              ) AS session_id
          FROM
              sessionized
      ),
      session_bounds AS (
          SELECT
              username,
              session_id,
              DATE_TRUNC($3, MIN(created_at)) AS session_value,
              EXTRACT(
                  EPOCH
                  FROM
                      MAX(created_at) - MIN(created_at)
              ) AS session_duration_sec
          FROM
              session_ids
          GROUP BY
              username,
              session_id
      )
      SELECT
           session_value as DATE,
          COUNT(*)::integer AS "sessionCount",
          ROUND(AVG(session_duration_sec), 2)::integer AS "durationInSeconds"
      FROM
          session_bounds
      WHERE
          session_duration_sec > 0
      GROUP BY
          session_value
      ORDER BY
          session_value;
      `,
      [from, to, interval]
    );
    client.release();
    const data = result.rows as {
      date: Date;
      sessionCount: number;
      durationInSeconds: number;
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
