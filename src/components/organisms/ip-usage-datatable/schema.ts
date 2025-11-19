import { z } from "zod";

export const ipUsageSchema = z.object({
  ip_address: z.string(),
  total_hits: z.number(),
  anon_hits: z.number(),
  auth_hits: z.number(),
  anon_pct: z.number(),
  first_seen: z.string(),
  last_seen: z.string(),
});

export type IpUsage = z.infer<typeof ipUsageSchema>;

