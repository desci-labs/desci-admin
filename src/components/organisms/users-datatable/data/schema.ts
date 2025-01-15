import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const userSchema = z.object({
  id: z.coerce.number(),
  email: z.string().nullable().default('-'),
  name: z.string().nullable().default('-'),
  isAdmin: z.boolean(),
  createdAt: z.string(),
  orcid: z.string().optional().nullable().default('-'),
});

export type User = z.infer<typeof userSchema>;
