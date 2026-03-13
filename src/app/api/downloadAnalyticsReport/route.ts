import { NODES_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const response = await fetch(
      `${NODES_API_URL}/v1/admin/analytics/querycsv${url.search}`,
      {
        credentials: "include",
        headers: {
          cookie: cookies().toString(),
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch report" },
        { status: response.status }
      );
    }

    if (!response.body) {
      return NextResponse.json(
        { error: "Missing response body" },
        { status: 502 }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="report.csv"',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
