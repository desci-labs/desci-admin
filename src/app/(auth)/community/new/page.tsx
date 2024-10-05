"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createCommunity } from "@/app/actions";
import CommunityForm from "@/components/organisms/forms/community-form";

const defaultState: ReturnType<typeof createCommunity> = Promise.resolve({
  ok: false,
});

export default function Page() {
  const [state, formAction] = useFormState<ReturnType<typeof createCommunity>>(
    createCommunity,
    defaultState
  );

  const { pending } = useFormStatus();

  return (
    <CommunityForm
      formAction={formAction}
      state={state}
      defaultValues={{
        name: "",
        subtitle: "",
        description: "",
        hidden: false,
        keywords: [],
        slug: "",
        links: [""],
      }}
      pending={pending}
    />
  );
}
