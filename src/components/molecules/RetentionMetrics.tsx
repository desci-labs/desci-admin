"use client";

import { MetricCard } from "./MetricCard";
import { tags } from "@/lib/tags";
import { getRetentionMetrics } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ErrorMessage } from "../ui/error-message";

export function RetentionMetrics() {
  const {
    data: metrics,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: [tags.retentionMetrics],
    queryFn: () => getRetentionMetrics(),
    retry: 2,
    retryDelay: (failureCount, error) => {
      return failureCount * 1000;
    },
  });
  if (isError) {
    return (
      <ErrorMessage
        message={
          error?.message ??
          "An error occurred while fetching metrics. Please try again."
        }
      />
    );
  }

  console.log("metrics", metrics);

  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-3xl font-bold tracking-tight">Retention Metrics</h2> */}
        <p className="text-muted-foreground">
          Evaluate user return behavior after signup based on logging in and
          active engagement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Day 1 Retention"
          value={`${metrics?.day1Retention ?? 0}%`}
          description="Users who returned the day after signup"
          isLoading={isFetching}
        />
        <MetricCard
          title="Day 7 Retention"
          value={`${metrics?.day7Retention ?? 0}%`}
          description="Users who returned after 7 days"
          isLoading={isFetching}
        />
        <MetricCard
          title="Day 30 Retention"
          value={`${metrics?.day30Retention ?? 0}%`}
          description="Users who returned after 30 days"
          isLoading={isFetching}
        />
        <MetricCard
          title="Day 365 Retention"
          value={`${metrics?.day365Retention ?? 0}%`}
          description="Users who returned after 365 days"
          isLoading={isFetching}
        />
      </div>
    </div>
  );
}
