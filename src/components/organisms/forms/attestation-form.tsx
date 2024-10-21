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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Layout, LayoutBody } from "@/components/custom/Layout";
import { createAttestation } from "@/app/actions";
import { useFormStatus } from "react-dom";
import React, {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
} from "react";
import { getQueryClient } from "@/lib/get-query-client";
import { tags } from "@/lib/tags";

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
});

type FormValues = z.infer<typeof attestationSchema>;

export default function AttestationForm({
  formAction,
  defaultValues,
  state,
}: // pending,
{
  formAction: (formData: FormData) => void;
  state: ReturnType<typeof createAttestation>;
  defaultValues?: FormValues;
  // pending: boolean;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(attestationSchema),
    defaultValues,
  });

  function onSubmit(data: FormValues) {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("protected", data.protected.toString());
    formData.append("communityId", data.communityId);

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

    // Log the FormData (for demonstration purposes)
    for (let [key, value] of Array.from(formData.entries())) {
      console.log(`${key}: ${value}`);
    }

    formAction(formData);
  }

  const formState = state as unknown as Awaited<
    ReturnType<typeof createAttestation>
  >;

  useEffect(() => {
    console.log("attestationForm", formState);
    if (formState?.ok) {
      getQueryClient().invalidateQueries({
        queryKey: [tags.attestations],
      });
      // todo: show success toast
    }
  }, [defaultValues?.communityId, form, formState]);

  const isProtected = form.watch("protected");
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
            <SubmitButton type="submit" disabled={form.formState.isSubmitting}>
              Submit Attestation
            </SubmitButton>
          </form>
        </Form>
      </LayoutBody>
    </Layout>
  );
}

// const SubmitButton: ComponentType<'button'> = (props) => {
//   const { pending } = useFormStatus();

//   return <Button {...props} />
// };

const SubmitButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const { pending } = useFormStatus();

    return <Button ref={ref} {...props} disabled={pending || props.disabled} />;
  }
);

SubmitButton.displayName = "SubmitButton";
