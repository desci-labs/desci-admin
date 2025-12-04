import { NextRequest, NextResponse } from "next/server";
import { NODES_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { analyticsQuerySchema } from "@/lib/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { from, to, interval } = analyticsQuerySchema.parse(
      Object.fromEntries(searchParams)
    );

    const response = await fetch(
      `${NODES_API_URL}/v1/admin/analytics/new-sciweave-users?from=${from.toISOString()}&to=${to.toISOString()}&interval=${interval}`,
      {
        credentials: "include",
        headers: {
          cookie: cookies().toString(),
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching new sciweave users:", error);
    return NextResponse.json(
      { error: "Failed to fetch new sciweave users" },
      { status: 500 }
    );
  }
}
