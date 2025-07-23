import { NODES_API_URL } from "@/lib/config";
import { AUTH_COOKIE_FIELDNAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(_request: Request) {
  try {
    const logoutRes = await fetch(`${NODES_API_URL}/v1/auth/logout`, {
      method: "delete",
      credentials: "include",
      headers: {
        cookie: cookies().toString(),
      },
    });

    if (logoutRes.ok && logoutRes.status === 200) {
      for (const field of Array.from((await cookies()).getAll())) {
        (await cookies()).delete(field.name);
      }
    }
    return NextResponse.json({ ok: logoutRes.ok });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
