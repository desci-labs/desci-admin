"use server";

import { NODES_API_URL, RETURN_DEV_TOKEN } from "@/lib/config";
import { AUTH_COOKIE_FIELDNAME } from "@/lib/constants";
import { cookies } from "next/headers";

export type LoginUserData = {
  email: string;
  termsAccepted: boolean;
  token: string;
};

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") ?? prevState?.email;
  const code = formData.get("code");

  const res = await fetch(`${NODES_API_URL}/v1/auth/magic`, {
    method: "POST",
    body: JSON.stringify({
      email,
      code,
      ...(RETURN_DEV_TOKEN && { dev: true }),
    }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  let response = await res.json();

  if (response.ok && response.user) {
    // Set cookie
    cookies().set(AUTH_COOKIE_FIELDNAME, response.user.token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 3 hours
      httpOnly: true,
      secure: process.env.NEXT_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? ".desci.com" : undefined,
    });

    if (
      AUTH_COOKIE_FIELDNAME === "auth-dev" &&
      process.env.NEXT_ENV === "development"
    ) {
      console.log("[cookie]", AUTH_COOKIE_FIELDNAME, process.env.NEXT_ENV);
      cookies().set("auth", response.user.token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 1), // 2 hours
        httpOnly: true,
        secure: true,
        // domain: '.desci.com',
      });
    }

    if (process.env.NEXT_ENV === "production") {
      cookies().set(AUTH_COOKIE_FIELDNAME, response.user.token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours
        httpOnly: true,
        secure: true,
        domain: ".desci.com",
      });
    }

    return {
      ok: true,
      email,
      user: response.user,
    };
  } else if (response.ok && !response.user) {
    return {
      ok: true,
      email,
    };
  } else {
    return response;
  }
}

export async function logout() {
  console.log("[PRE LOGOUT]", { cookies: cookies().toString() });
  const logoutRes = await fetch(`${NODES_API_URL}/v1/auth/logout`, {
    method: "delete",
    credentials: "include",
    headers: {
      cookie: cookies().toString(),
    },
  });

  cookies().delete(AUTH_COOKIE_FIELDNAME);
  // if (logoutRes.ok && logoutRes.status === 200) {
  //   for (const field of Array.from(cookies().getAll())) {
  //     cookies().delete(field.name);
  //   }
  // }

  console.log("[LOGOUT]", {
    cookies: cookies().toString(),
    AUTH_COOKIE_FIELDNAME,
  });

  if (logoutRes.ok) {
    // Set cookie
    cookies().delete(AUTH_COOKIE_FIELDNAME);

    if (AUTH_COOKIE_FIELDNAME === "auth-dev") {
      cookies().set("auth-dev", "", {
        value: "",
        maxAge: 0,
        domain: ".desci.com",
      });
    }

    if (process.env.NEXT_ENV === "production") {
      cookies().set(AUTH_COOKIE_FIELDNAME, "", {
        value: "",
        maxAge: 0,
        domain: ".desci.com",
      });
    }

    console.log("[LOGOUT]", {
      cookies: cookies().toString(),
      AUTH_COOKIE_FIELDNAME,
    });

    return {
      ok: true,
    };
  }

  return { ok: false };
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
  const res = await fetch(`${NODES_API_URL}/v1/admin/communities`, {
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
  const res = await fetch(`${NODES_API_URL}/v1/admin/communities/${id}`, {
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
    `${NODES_API_URL}/v1/admin/communities/${id}/attestations`,
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
    `${NODES_API_URL}/v1/admin/communities/${id}/attestations/${attestationId}`,
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

export async function createJournal(_prevState: any, formData: FormData) {
  const res = await fetch(`${NODES_API_URL}/v1/journals`, {
    method: "POST",
    body: JSON.stringify({
      name: formData.get("name"),
      description: formData.get("description"),
      iconCid: formData.get("iconCid"),
    }),
    headers: {
      cookie: cookies().toString(),
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  let response = (await res.json()) as
    | { data: { journal: any } }
    | { message: string; error?: string[] };

  if (res.ok && "data" in response) {
    console.log("response", response.data);
    // Set cookie
    return {
      ok: true,
    };
  } else if (!("data" in response)) {
    console.log("response", response);
    return {
      ok: false,
      message: response.message,
      error: response.error,
    };
  } else {
    return { ok: false, message: "Unknown error occurred", error: [] };
  }
}

export async function updateJournal(_prevState: any, formData: FormData) {
  const id = formData.get("journalId");
  formData.delete("journalId");

  if (!id) {
    return { ok: false, message: "No journal ID", error: [] };
  }
  const res = await fetch(`${NODES_API_URL}/v1/journals/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: formData.get("name"),
      description: formData.get("description"),
      iconCid: formData.get("iconCid"),
    }),
    headers: {
      cookie: cookies().toString(),
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  let response = (await res.json()) as
    | { data: { journal: any } }
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
