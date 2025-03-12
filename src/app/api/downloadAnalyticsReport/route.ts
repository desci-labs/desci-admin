import { NODES_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    // const queries = Object.entries(url.searchParams).map(([key, value]) => `${key}=${value}`).join('&')
    console.log('params: ',url)
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
    return response
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
