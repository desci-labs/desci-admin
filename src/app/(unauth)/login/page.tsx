"use client";

import LoginForm from "@/components/molecules/LoginForm";
// @ts-ignore
import { useFormState, useFormStatus } from "react-dom";
import { login, LoginUserData } from "@/app/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_COOKIE_FIELDNAME } from "@/lib/constants";
import { toast } from "sonner";

const initialState: {
  email?: string;
  ok?: boolean;
  error?: string;
  user?: LoginUserData;
} = {};

export default function Login() {
  const [state, formAction] = useFormState(login, initialState);
  const router = useRouter();

  console.log('[login]', { state })

  useEffect(() => {
    if (state?.user) {
      toast.success('Login in successful 🎉')
      router.refresh();
    }
  }, [router, state?.user])

  return (
    <div className="container mx-auto max-w-md">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold my-4">
          {!state?.email ? "Verify Email" : "Check your inbox"}
        </h1>
        <LoginForm
          login={formAction}
          email={state?.email}
          message={state?.error}
          disabled={state?.user !== undefined}
        />
      </div>
    </div>
  );
}
