import { NODES_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const format = request.nextUrl.searchParams.get("format") || "csv";
    const response = await fetch(
      `${NODES_API_URL}/v1/admin/users/export-marketing-consent?format=${format}`,
      {
        credentials: "include",
        headers: {
          cookie: cookies().toString(),
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
