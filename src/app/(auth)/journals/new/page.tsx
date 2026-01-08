"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createJournal } from "@/app/actions";
import JournalForm from "@/components/organisms/forms/journals-form";

const defaultState: ReturnType<typeof createJournal> = Promise.resolve({
  ok: false,
});

export default function Page() {
  const [state, formAction] = useFormState<ReturnType<typeof createJournal>>(
    createJournal,
    defaultState
  );

  const { pending } = useFormStatus();

  return (
    <JournalForm
      formAction={formAction}
      state={state}
      defaultValues={{
        body: {
          name: "",
          description: "",
          iconCid: "",
          imageUrl: "",
        },
      }}
      pending={pending}
    />
  );
}
