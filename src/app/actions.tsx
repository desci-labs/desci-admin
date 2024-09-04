"use server";

import { AUTH_COOKIE_FIELDNAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type LoginUserData = {
  email: string;
  termsAccepted: boolean;
  token: string;
};

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") ?? prevState?.email;
  const code = formData.get("code");

  const res = await fetch(`${API_URL}/v1/auth/magic`, {
    method: "POST",
    body: JSON.stringify({ email, code }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  let response = await res.json();

  if (response.ok && response.user) {
    // Set cookie
    cookies().set(AUTH_COOKIE_FIELDNAME, response.user.token);
    redirect(`/`);
  }

  if (response.ok && !response.user) {
    return {
      ok: true,
      email,
    };
  }

  return response;
}
