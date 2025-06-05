"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layout, LayoutBody } from "@/components/custom/Layout";
import { useEffect } from "react";
import { getQueryClient } from "@/lib/get-query-client";
import { tags } from "@/lib/tags";
import { useRouter } from "next/navigation";

const createJournalSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Journal name cannot be empty."),
    description: z.string().optional(),
    iconCid: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof createJournalSchema>;

export default function JournalForm({
  formAction,
  defaultValues,
  state,
  pending,
}: {
  formAction: (formData: FormData) => void;
  state: any;
  defaultValues?: FormValues;
  pending: boolean;
}) {
  const formState = state;

  const form = useForm<FormValues>({
    resolver: zodResolver(createJournalSchema),
    defaultValues: defaultValues || {
      body: {
        name: "",
        description: "",
        iconCid: "",
      },
    },
  });

  const router = useRouter();

  function onSubmit(data: FormValues) {
    const formData = new FormData();

    // Append form fields
    formData.append("name", data.body.name);
    if (data.body.description) {
      formData.append("description", data.body.description);
    }
    if (data.body.iconCid) {
      formData.append("iconCid", data.body.iconCid);
    }

    formAction(formData);
  }

  useEffect(() => {
    if (formState?.ok) {
      getQueryClient().invalidateQueries({ queryKey: [tags.journals] });
      router.back();
    }
  }, [form, formState, router]);

  return (
    <Layout>
      <LayoutBody className="max-w-4xl mx-auto">
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Create a New Journal
            </h2>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="body.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Journal name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Journal description"
                      {...field}
                      className="min-h-[100px] resize-y"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body.iconCid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon CID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter IPFS CID for journal icon"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Provide an IPFS CID for the journal icon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formState?.message && (
              <p className="text-destructive text-lg my-2">
                {formState.message}
              </p>
            )}
            {formState?.error && (
              <ul>
                {formState.error.map((error: string, idx: number) => (
                  <li key={idx} className="text-destructive-foreground">
                    {error}
                  </li>
                ))}
              </ul>
            )}
            <Button type="submit" disabled={pending}>
              Submit
            </Button>
          </form>
        </Form>
      </LayoutBody>
    </Layout>
  );
}
