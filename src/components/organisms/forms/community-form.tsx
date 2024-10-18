"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { Layout, LayoutBody } from "@/components/custom/Layout";
import { createCommunity } from "@/app/actions";
import { useEffect } from "react";
import { getQueryClient } from "@/lib/get-query-client";
import { tags } from "@/lib/tags";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const addCommunitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  subtitle: z.string().min(1, "Subtitle cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
  hidden: z.boolean().default(false),
  keywords: z
    .array(z.string())
    .min(1, "Community must have at least one keyword"),
  image_url: z.string().url().optional(),
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
  slug: z.string().min(3),
  links: z.array(z.string().url()).min(1, "At least one link is required"),
});

type FormValues = z.infer<typeof addCommunitySchema>;

export default function CommunityForm({
  formAction,
  defaultValues,
  state,
  pending,
}: {
  formAction: (formData: FormData) => void;
  state: ReturnType<typeof createCommunity>;
  defaultValues?: FormValues;
  pending: boolean;
}) {
  const formState = state as unknown as Awaited<
    ReturnType<typeof createCommunity>
  >;

  const form = useForm<FormValues>({
    resolver: zodResolver(addCommunitySchema),
    defaultValues,
  });

  const {
    fields: keywordFields,
    append: appendKeyword,
    remove: removeKeyword,
  } = useFieldArray({
    control: form.control,
    name: "keywords",
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: "links",
  });

  function onSubmit(data: FormValues) {
    const formData = new FormData();

    // Append simple fields
    formData.append("name", data.name);
    formData.append("subtitle", data.subtitle);
    formData.append("description", data.description);
    formData.append("hidden", data.hidden.toString());
    formData.append("slug", data.slug);

    // Append array fields
    data.keywords.forEach((keyword, index) => {
      formData.append(`keywords[${index}]`, keyword);
    });

    data.links.forEach((link, index) => {
      formData.append(`links[${index}]`, link);
    });

    // Append optional fields
    if (data.image_url) {
      formData.append("imageUrl", data.image_url);
    }

    // Append file if it exists
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    // Log the FormData (for demonstration purposes)
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    formAction(formData);
  }

  useEffect(() => {
    if (formState?.ok) {
      getQueryClient().invalidateQueries({ queryKey: [tags.communities] });
      // todo: show success toast
    }
  }, [form, formState]);

  return (
    <Layout>
      <LayoutBody className="max-w-4xl mx-auto">
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Complete this form to add a new Community
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
                    <Input placeholder="Community name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="community-slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    The unique identifier for your community in the URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Input placeholder="Community subtitle" {...field} />
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
                      placeholder="Community description"
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
              name="hidden"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Hidden</FormLabel>
                    <FormDescription>
                      Make this community hidden from public view
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

            <FormField
              control={form.control}
              name="image_url"
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
                    Optional: Provide a URL for the community image
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
                    Upload an image for your community (max 5MB, .jpg, .png,
                    .webp, .gif)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={() => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormDescription>
                    Add keywords that describe your community
                  </FormDescription>
                  <div className="space-y-2">
                    {keywordFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <Input
                            {...form.register(`keywords.${index}`)}
                            placeholder="Enter a keyword"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeKeyword(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove keyword</span>
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => appendKeyword("")}
                    >
                      Add Keyword
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="links"
              render={() => (
                <FormItem>
                  <FormLabel>Links</FormLabel>
                  <FormDescription>
                    Add links related to your community
                  </FormDescription>
                  <div className="space-y-2">
                    {linkFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <Input
                            {...form.register(`links.${index}`)}
                            placeholder="https://example.com"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeLink(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove link</span>
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => appendLink("")}
                    >
                      Add Link
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Button type="submit" disabled={pending}>
              Submit
            </Button>
          </form>
        </Form>
      </LayoutBody>
    </Layout>
  );
}
