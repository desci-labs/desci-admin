"use client";

import { useFormState } from "react-dom";
import { createAttestation } from "@/app/actions";
import AttestationForm from "@/components/organisms/forms/attestation-form";
import { useQuery } from "@tanstack/react-query";
import { listCommunitiesQuery } from "@/lib/api";
import NotFoundError from "@/app/not-found";
import { getQueryClient } from "@/lib/get-query-client";

const defaultState: ReturnType<typeof createAttestation> = Promise.resolve({
  ok: false,
});

export default function Page({ params }: { params: { id: string } }) {
  const [state, formAction] = useFormState<
    ReturnType<typeof createAttestation>
  >(createAttestation, defaultState);

  // todo: add skeleton loader
  const { data, isLoading } = useQuery(listCommunitiesQuery, getQueryClient());
  const community = data?.find((com) => com.id === parseInt(params.id));

  if (!community) return <NotFoundError />;
  return (
    <AttestationForm
      formAction={formAction}
      state={state}
      defaultValues={{
        name: "",
        description: "",
        protected: false,
        canMintDoi: false,
        canUpdateOrcid: false,
        communityId: params.id,
      }}
    />
  );
}
