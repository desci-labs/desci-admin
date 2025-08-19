"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Layout, LayoutBody } from "@/components/custom/Layout";
import { createAttestation } from "@/app/actions";
import { useFormStatus } from "react-dom";
import React, { useEffect, useRef, useState } from "react";
import { getQueryClient } from "@/lib/get-query-client";
import { tags } from "@/lib/tags";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const attestationSchema = z.object({
  communityId: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url().optional(),
  verifiedImageUrl: z.string().url().optional(),
  image: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png, .webp and .gif files are accepted."
    )
    .optional(),
  verifiedImage: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png, .webp and .gif files are accepted."
    )
    .optional(),
  protected: z.coerce
    .boolean()
    .transform((value) => (value.toString() === "true" ? true : false))
    .default(false),
  canMintDoi: z.coerce
    .boolean()
    .transform((value) => (value.toString() === "true" ? true : false))
    .default(false),
  canUpdateOrcid: z.coerce
    .boolean()
    .transform((value) => (value.toString() === "true" ? true : false))
    .default(false),
});

type FormValues = z.infer<typeof attestationSchema>;

export default function AttestationForm({
  formAction,
  defaultValues,
  state,
  isEdit = false,
}: {
  formAction: (formData: FormData) => void;
  state: ReturnType<typeof createAttestation>;
  defaultValues?: FormValues;
  isEdit?: boolean;
}) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [publishNew, setPublishNew] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(attestationSchema),
    defaultValues,
  });

  const formRef = useRef<HTMLFormElement>(null);

  function onSubmit(data: FormValues) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("protected", data.protected.toString());
    formData.append("canMintDoi", data.canMintDoi.toString());
    formData.append("canUpdateOrcid", data.canUpdateOrcid.toString());
    formData.append("communityId", data.communityId);

    if (isEdit) {
      formData.append("publishNew", publishNew.toString());
    }

    if (data.imageUrl) {
      formData.append("imageUrl", data.imageUrl);
    }
    if (data.verifiedImageUrl) {
      formData.append("verifiedImageUrl", data.verifiedImageUrl);
    }
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    if (data.verifiedImage && data.verifiedImage[0]) {
      formData.append("verifiedImage", data.verifiedImage[0]);
    }

    setShowDialog(false);
    formAction(formData);
  }

  const formState = state as unknown as Awaited<
    ReturnType<typeof createAttestation>
  >;

  useEffect(() => {
    if (formState?.ok) {
      getQueryClient().invalidateQueries({
        queryKey: [tags.attestations],
      });
      getQueryClient().invalidateQueries({
        queryKey: [{ type: tags.attestations, id: defaultValues?.communityId }],
      });
      router.back();
    }
  }, [defaultValues?.communityId, form, formState, router]);

  const presubmit = () => {
    if (
      form.formState.dirtyFields.name ||
      form.formState.dirtyFields.description
    ) {
      setShowDialog(true);
    } else {
      formRef.current?.submit();
    }
  };
  const isProtected = form.watch("protected");

  const isIntentChanged =
    form.formState.dirtyFields.name || form.formState.dirtyFields.description;
  return (
    <Layout>
      <LayoutBody className="max-w-4xl mx-auto">
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Create new Attestation
            </h2>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            ref={formRef}
            className="space-y-8"
            id="attestationForm"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Attestation name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Attestation description"
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Provide a URL for the attestation image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload an image for your attestation (max 5MB, .jpg, .png,
                    .webp, .gif)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="protected"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Protected</FormLabel>
                    <FormDescription>
                      Make this attestation protected
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {isProtected && (
              <FormField
                control={form.control}
                name="canMintDoi"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        DOI Mint Privilege
                      </FormLabel>
                      <FormDescription>
                        Authorize this attestation to mint DOI, if a claim on
                        this attestation gets verified it automatically mints a
                        DOI for the associated research object.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {isProtected && (
              <FormField
                control={form.control}
                name="canUpdateOrcid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        ORCID Work Record Privilege
                      </FormLabel>
                      <FormDescription>
                        Authorize this attestation to update ORCID work record,
                        if a claim on this attestation gets verified it
                        automatically reflects on the user&apos;s ORCID work
                        record.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {isProtected && (
              <FormField
                control={form.control}
                name="verifiedImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verified Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/verified-image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Provide a URL for the verified attestation image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isProtected && (
              <FormField
                control={form.control}
                name="verifiedImage"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Upload Verified Image Icon</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image to signal verification for your
                      attestation (max 5MB, .jpg, .png, .webp, .gif)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {formState?.message && (
              <p className="text-destructive text-lg my-2">
                {formState.message}
              </p>
            )}
            {formState.error && (
              <ul>
                {formState.error.map((error, idx) => (
                  <li key={idx} className="text-destructive-foreground">
                    {error}
                  </li>
                ))}
              </ul>
            )}

            {!isEdit && (
              <SubmitButton
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                Submit Attestation
              </SubmitButton>
            )}

            {isEdit && (
              <Dialog
                open={showDialog}
                onOpenChange={(open) => setShowDialog(open)}
              >
                <DialogTrigger asChild>
                  <SubmitButton disabled={form.formState.isSubmitting}>
                    Submit Attestation
                  </SubmitButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    {isIntentChanged && (
                      <DialogDescription>
                        This action cannot be undone. This will publish a new
                        version of this attestation and require all submissions
                        to reclaim the updated attestation to rejoin the
                        community.
                      </DialogDescription>
                    )}
                  </DialogHeader>
                  {isIntentChanged && (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="intent"
                        checked={publishNew}
                        onCheckedChange={(checked) =>
                          setPublishNew(checked as boolean)
                        }
                      />
                      <label
                        htmlFor="intent"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Publish new version of attestation
                      </label>
                    </div>
                  )}
                  <DialogFooter className="gap-4">
                    <DialogClose>Cancel</DialogClose>
                    <SubmitButton
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      form="attestationForm"
                    >
                      Continue
                    </SubmitButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </form>
        </Form>
      </LayoutBody>
    </Layout>
  );
}

const SubmitButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    const { pending } = useFormStatus();

    return <Button ref={ref} {...props} disabled={pending || props.disabled} />;
  }
);

SubmitButton.displayName = "SubmitButton";
