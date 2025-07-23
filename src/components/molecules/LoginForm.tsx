"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { HTMLProps, useCallback, useMemo, useState } from "react";
import { Loader, Loader2Icon, LoaderIcon } from "lucide-react";
import { toast } from "sonner";
import { sendMagicLink, verifyCode } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { useRouter } from "next/navigation";
import { applyDevCookies } from "@/lib/api/cookies";

export default function LoginForm({
  login,
  email,
  message,
  disabled,
}: {
  login: (formData: FormData) => void;
  email: string;
  message?: string;
  disabled: boolean;
}) {
  const router = useRouter();
  // const [email, setEmail] = useState<string>();
  // const [pending, setPending] = useState(false);
  // const pending = false;
  const queryClient = getQueryClient();
  const { mutate: sendMagicLinkMutation, isPending: sendMagicLinkPending } =
    useMutation(
      {
        mutationFn: sendMagicLink,
      },
      queryClient
    );
  const { mutate: verifyCodeMutation, isPending: verifyCodePending } =
    useMutation(
      {
        mutationFn: verifyCode,
      },
      queryClient
    );
  const pending = sendMagicLinkPending || verifyCodePending;
  console.log("[LoginForm]:: ", { email });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const code = formData.get("code") as string;
      console.log("[handleSubmit]:: ", email, code);
      if (code) {
        // setPending(true);
        verifyCodeMutation(
          { email: email!, code },
          {
            onSuccess: (data) => {
              console.log("[token]", data.user.token);
              applyDevCookies(data.user.token);
              router.push("/", { scroll: false });
            },
            onSettled: () => {
              // setPending(false);
            },
          }
        );
      } else {
        // setPending(true);
        const email = formData.get("email") as string;
        sendMagicLinkMutation(
          { email },
          {
            onSuccess: (data) => {
              // setEmail(email);
            },
            onSettled: () => {
              // setPending(false);
            },
          }
        );
      }
    },
    [email, router, sendMagicLinkMutation, verifyCodeMutation]
  );

  return (
    <form
      action={login}
      // onSubmit={handleSubmit}
      className="flex flex-col space-y-4 items-start justify-center w-full gap-3"
    >
      <p className="text-txt-neutral text-sm mb-2">
        {!email
          ? "Please enter your email below so we can send you a verification code to make sure it's really you."
          : `We just sent a verification code to ${email}. Enter the code below. Enter the code below to create your account.`}
      </p>
      <div className="w-full flex flex-col items-stretch space-y-6">
        <div className="flex flex-col gap-2 w-full">
          <label
            htmlFor="email"
            className="capitalize tracking-wider text-txt-focus text-xs font-semibold"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            className="text-txt-focus border-2 border-border-neutral focus:invalid:border-red-400 focus-visible:valid:border-btn-surface-primary-focus focus-visible:outline-none focus-visible:ring-0"
            placeholder="user@email.com"
            autoFocus
            required
            disabled={!!email || pending}
          />
        </div>

        {email && (
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="code"
              className="capitalize tracking-wider text-txt-focus text-xs font-semibold"
            >
              Verification Code
            </label>
            <Input
              id="code"
              name="code"
              type="text"
              defaultValue=""
              required
              placeholder="XXXXXX"
              disabled={pending}
              className="text-txt-focus border-2 border-border-neutral focus:invalid:border-red-400 focus-visible:valid:border-btn-surface-primary-focus focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
        )}
      </div>
      {message && <p className="text-sm text-red-500 mb-2">{message}</p>}
      <SubmitButton disabled={disabled} email={email} />
    </form>
  );
}

const SubmitButton = (
  props: HTMLProps<HTMLButtonElement> & {
    email?: string;
  }
) => {
  const { pending } = useFormStatus();

  const message = useMemo(() => {
    if (props.email && pending) return "Verifying code";
    if (!props.email && pending) return "Verifying email";
    if (!props.email && !pending) return "Verify email";
    if (props.email && !pending) return "Send code";
  }, [props.email, pending]);
  return (
    <Button
      className="self-stretch font-semibold text-lg h-12 bg-btn-surface-primary-neutral border-btn-border-primary-focus hover:bg-btn-surface-primary-focus "
      variant="outline"
      type="submit"
      disabled={pending || props.disabled}
    >
      <span className="mr-1">{message} </span>{" "}
      {pending && <Loader2Icon className="size-5 animate-spin" />}
    </Button>
  );
};
