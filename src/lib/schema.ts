import z from "zod";

export const analyticsQuerySchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  interval: z.enum(["daily", "weekly", "monthly"]).optional().default("weekly"),
});

export const intervalToDateTruncMap = {
  daily: "day",
  weekly: "week",
  monthly: "month",
};

export const intervalToDateTrunc = (
  interval: keyof typeof intervalToDateTruncMap
): string => {
  return intervalToDateTruncMap[interval];
};
