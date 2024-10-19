import { NODES_API_URL } from "@/lib/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(
      `${NODES_API_URL}/v1/admin/communities/${body.communityId}/addMember`,
      {
        body: JSON.stringify(body),
        method: "POST",
        credentials: "include",
        headers: {
          cookie: cookies().toString(),
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      }
    );

    return NextResponse.json(await response.json(), {
      status: response.status,
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    return await fetch(
      `${NODES_API_URL}/v1/admin/communities/${body.communityId}/removeMember/${body.memberId}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          cookie: cookies().toString(),
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
