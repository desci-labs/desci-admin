import { redirect } from "next/navigation";

/**
 * Admin app has no signup flow; magic links or external links may point to /signup.
 * Redirect to /login and preserve query params (e.g. code, e, returnTo) so the
 * login flow can complete.
 */
export default function SignupPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = new URLSearchParams();
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined) {
        search.set(key, Array.isArray(value) ? value[0] : value);
      }
    });
  }
  const query = search.toString();
  redirect(`/login${query ? `?${query}` : ""}`);
}
