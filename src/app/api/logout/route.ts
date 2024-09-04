import { NODES_API_URL } from "@/lib/config";
import { AUTH_COOKIE_FIELDNAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(_request: Request) {
    try {
        const logoutRes = await fetch(`${NODES_API_URL}/v1/auth/logout"`, {
            method: "delete",
            credentials: "include",
            headers: {
                cookie: cookies().toString(),
            },
        });
        console.log("LOGOUT", logoutRes);
        cookies().delete(AUTH_COOKIE_FIELDNAME);
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: e }, { status: 500 });
    }
}
