import { NODES_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const resource = request.nextUrl.searchParams.get('resource')
    const proxyUrl = `${NODES_API_URL}/v1/admin/analytics/${resource}${request.nextUrl.search}&exportCsv=true`;
    
    console.log('[url]', {proxyUrl });
    const response = await fetch(
      proxyUrl,
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
