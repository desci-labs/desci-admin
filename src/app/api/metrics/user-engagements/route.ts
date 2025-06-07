import { NODES_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(
      `${NODES_API_URL}/v1/admin/metrics/user-engagements`,
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
    console.error("Error fetching user engagement metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch user engagement metrics" },
      { status: 500 }
    );
  }
}
