"use client";

import { useQuery } from "@tanstack/react-query";
import { listAttestationsQuery } from "@/lib/api";
import { useFormState, useFormStatus } from "react-dom";
import { updateAttestation } from "@/app/actions";
import AttestationForm from "@/components/organisms/forms/attestation-form";
import NotFoundError from "@/app/not-found";
import { getQueryClient } from "@/lib/get-query-client";

const defaultState: ReturnType<typeof updateAttestation> = Promise.resolve({
  ok: false,
});

export default function Page({
  params,
}: {
  params: { id: string; attestationId: string };
}) {
  const [state, formAction] = useFormState<
    ReturnType<typeof updateAttestation>
  >(updateAttestation, defaultState);
  useFormStatus();
  // todo: add skeleton loader
  const { data, isLoading } = useQuery(listAttestationsQuery, getQueryClient());
  const attestation = data?.find((com) => com.id === parseInt(params.attestationId));

  if (!attestation) return <NotFoundError />
  return (
    <AttestationForm
      formAction={(formdata) => {
        formdata.append("attestationId", attestation.id.toString());
        formAction(formdata);
      }}
      state={state}
      defaultValues={{
        name: attestation.name,
        description: attestation.description,
        protected: attestation.protected,
        communityId: attestation.communityId.toString(),
        imageUrl: attestation.image_url,
        ...(attestation.verified_image_url && { verifiedImageUrl: attestation.verified_image_url})
      }}
    />
  );
}