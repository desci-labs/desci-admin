"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { listCommunitiesQuery } from "@/lib/api";
import { useFormState, useFormStatus } from "react-dom";
import { updateCommunity } from "@/app/actions";
import CommunityForm from "@/components/organisms/forms/community-form";

const defaultState: ReturnType<typeof updateCommunity> = Promise.resolve({
  ok: false,
});

export default function CommunityDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading } = useSuspenseQuery(listCommunitiesQuery);
  const community = data?.data?.find((com) => com.id === parseInt(params.id));

  const [state, formAction] = useFormState<ReturnType<typeof updateCommunity>>(
    updateCommunity,
    defaultState
  );

  const { pending } = useFormStatus();

  console.log("details", { community, id: params.id });
  if (isLoading || !community) {
    return <div>Loading...</div>;
  }
  return (
    <CommunityForm
      formAction={(formdata) => {
        formdata.append("communityId", community.id.toString());
        formAction(formdata);
      }}
      state={state}
      defaultValues={community}
      pending={pending}
    />
  );
}
