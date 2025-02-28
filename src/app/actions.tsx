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
    cookies().set(AUTH_COOKIE_FIELDNAME, response.user.token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
      httpOnly: true,
      secure: process.env.NEXT_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? ".desci.com" : undefined,
    });

    // if (
    //   AUTH_COOKIE_FIELDNAME === "auth-dev" &&
    //   process.env.NEXT_ENV === "development"
    // ) {
    //   console.log('[cookie]', AUTH_COOKIE_FIELDNAME, process.env.NEXT_ENV)
    //   cookies().set('auth', response.user.token, {
    //     path: "/",
    //     expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 1), // 2 hours
    //     httpOnly: true,
    //     secure: true,
    //     // domain: '.desci.com',
    //   });
    // }

    if (process.env.NEXT_ENV === "production") {
      cookies().set(AUTH_COOKIE_FIELDNAME, response.user.token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
        httpOnly: true,
        secure: true,
        domain: "nodes.desci.com",
      });
      cookies().set(AUTH_COOKIE_FIELDNAME, response.user.token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
        httpOnly: true,
        secure: true,
        domain: ".desci.com",
      });
    }

    // cookies().set(AUTH_COOKIE_FIELDNAME, response.user.token);
    return {
      ok: true,
      email,
      user: response.user,
    };
    // redirect("/");
  } else if (response.ok && !response.user) {
    return {
      ok: true,
      email,
    };
  } else {
    return response;
  }

  // return response;
}

type CreateCommunityState =
  | {
      ok: boolean;
      message?: undefined;
      error?: undefined;
    }
  | {
      ok: boolean;
      message: string;
      error: string[] | undefined;
    };

export async function createCommunity(_prevState: any, formData: FormData) {
  const res = await fetch(`${API_URL}/v1/admin/communities`, {
    method: "POST",
    body: formData,
    headers: { cookie: cookies().toString() },
    credentials: "include",
  });
  let response = (await res.json()) as
    | { data: { community: any } }
    | { message: string; error?: string[] };

  if (res.ok && "data" in response) {
    // Set cookie
    return {
      ok: true,
    };
  } else if (!("data" in response)) {
    return {
      ok: false,
      message: response.message,
      error: response.error,
    };
  } else {
    return { ok: false, message: "Unknown error occurred", error: [] };
  }
}

export async function updateCommunity(_prevState: any, formData: FormData) {
  const id = formData.get("communityId");
  formData.delete("communityId");

  if (!id) {
    return { ok: false, message: "No community ID", error: [] };
  }
  const res = await fetch(`${API_URL}/v1/admin/communities/${id}`, {
    method: "PUT",
    body: formData,
    headers: { cookie: cookies().toString() },
    credentials: "include",
  });
  let response = (await res.json()) as
    | { data: { community: any } }
    | { message: string; error?: string[] };

  if (res.ok && "data" in response) {
    // Set cookie
    return {
      ok: true,
    };
  } else if (!("data" in response)) {
    return {
      ok: false,
      message: response.message,
      error: response.error,
    };
  } else {
    return { ok: false, message: "Unknown error occurred", error: [] };
  }
}

export async function createAttestation(_prevState: any, formData: FormData) {
  const id = formData.get("communityId");
  formData.delete("communityId");

  if (!id) {
    return { ok: false, message: "No community ID", error: [] };
  }

  const res = await fetch(
    `${API_URL}/v1/admin/communities/${id}/attestations`,
    {
      method: "POST",
      body: formData,
      headers: { cookie: cookies().toString() },
      credentials: "include",
    }
  );
  let response = (await res.json()) as
    | { data: { community: any } }
    | { message: string; error?: string[] };

  if (res.ok && "data" in response) {
    // Set cookie
    return {
      ok: true,
    };
  } else if (!("data" in response)) {
    return {
      ok: false,
      message: response.message,
      error: response.error,
    };
  } else {
    return { ok: false, message: "Unknown error occurred", error: [] };
  }
}

export async function updateAttestation(_prevState: any, formData: FormData) {
  const id = formData.get("communityId");
  const attestationId = formData.get("attestationId");
  formData.delete("communityId");
  formData.delete("attestationId");

  if (!id) {
    return { ok: false, message: "No community ID", error: [] };
  }

  const res = await fetch(
    `${API_URL}/v1/admin/communities/${id}/attestations/${attestationId}`,
    {
      method: "PUT",
      body: formData,
      headers: { cookie: cookies().toString() },
      credentials: "include",
    }
  );
  let response = (await res.json()) as
    | { data: { community: any } }
    | { message: string; error?: string[] };

  if (res.ok && "data" in response) {
    // Set cookie
    return {
      ok: true,
    };
  } else if (!("data" in response)) {
    return {
      ok: false,
      message: response.message,
      error: response.error,
    };
  } else {
    return { ok: false, message: "Unknown error occurred", error: [] };
  }
}
