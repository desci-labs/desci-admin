import { NextRequest, NextResponse } from "next/server";
import { NODES_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { analyticsQuerySchema } from "@/lib/schema";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { from, to } = analyticsQuerySchema.parse(
      Object.fromEntries(searchParams)
    );

    const response = await fetch(
      `${NODES_API_URL}/v1/admin/analytics/sciweave-users/export?from=${from.toISOString()}&to=${to.toISOString()}`,
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

    // Return the CSV blob directly
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="sciweave-users-report.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting sciweave users:", error);
    return NextResponse.json(
      { error: "Failed to export sciweave users" },
      { status: 500 }
    );
  }
}
