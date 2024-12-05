"use client";

import LoginForm from "@/components/molecules/LoginForm";
// @ts-ignore
import { useFormState, useFormStatus } from "react-dom";
import { login, LoginUserData } from "@/app/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateAuth } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";

const initialState: {
  email?: string;
  ok?: boolean;
  error?: string;
  user?: LoginUserData;
} = {};

export default function Login() {
  const [state, formAction] = useFormState(login, initialState);
  const { pending } = useFormStatus();
  const { data: isLoggedIn, isLoading, refetch } = useSuspenseQuery(validateAuth);
  const router = useRouter();

  // const checkAuth = async () => {};

  useEffect(() => {
    console.log("[auth]", { isLoggedIn, isLoading });
    if (!isLoading && isLoggedIn) {
      // redirect to auth page
      router.push("/");
    }
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    if (state.user) {
      // router.push('/');
      window.location.reload();
    }
  }, [router, state.user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoaderCircleIcon className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold my-4">
          {!state?.email ? "Verify Email" : "Check your inbox"}
        </h1>
        <LoginForm
          login={formAction}
          pending={pending}
          email={state.email}
          message={state.error}
        />
      </div>
    </div>
  );
}
