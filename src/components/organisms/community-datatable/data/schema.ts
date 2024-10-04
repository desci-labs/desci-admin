import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
});

export const communitySchema = z.object({
  id: z.number(),
  name: z.string(),
  subtitle: z.string(),
  description: z.string(),
  hidden: z.coerce.boolean(),
  keywords: z.array(z.string()),
  image_url: z.string().url(), //"https://pub.desci.com/ipfs/bafkreie7kxhzpzhsbywcrpgyv5yvy3qxcjsibuxsnsh5olaztl2uvnrzx4",
  slug: z.string(),
  links: z.array(z.string().url()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Community = z.infer<typeof communitySchema>;
