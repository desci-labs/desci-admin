import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm({
  login,
  pending,
  email,
  message,
}: {
  login: (formData: FormData) => void;
  pending: boolean;
  email: string;
  message?: string;
}) {
  return (
    <form
      action={login}
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
            className="text-txt-focus border-2 border-border-neutral border-danger-text"
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
              className="text-txt-focus border-2 border-border-neutral border-danger-text"
            />
          </div>
        )}
      </div>
      {message && <p className="text-txt-neutral text-base mb-2">{message}</p>}
      <Button
        className="self-stretch font-semibold text-lg h-12"
        variant="outline"
        type="submit"
        disabled={pending}
      >
        {email ? "Send Code" : "Verify email"}
      </Button>
    </form>
  );
}
