"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { listJournalsQuery } from "@/lib/api";
import { useFormState, useFormStatus } from "react-dom";
import { updateCommunity, updateJournal } from "@/app/actions";
import JournalForm from "@/components/organisms/forms/journals-form";

const defaultState: ReturnType<typeof updateCommunity> = Promise.resolve({
  ok: false,
});

export default function JournalDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading } = useSuspenseQuery(listJournalsQuery);
  const journal = data?.find((journal) => journal.id === parseInt(params.id));

  const [state, formAction] = useFormState<ReturnType<typeof updateJournal>>(
    updateJournal,
    defaultState
  );

  const { pending } = useFormStatus();

  if (isLoading || !journal) {
    return <div>Loading...</div>;
  }
  return (
    <JournalForm
      formAction={(formdata) => {
        formdata.append("journalId", journal.id.toString());
        formAction(formdata);
      }}
      state={state}
      defaultValues={{
        body: {
          name: journal.name,
          description: journal?.description,
          iconCid: journal?.iconCid,
        },
      }}
      pending={pending}
    />
  );
}
