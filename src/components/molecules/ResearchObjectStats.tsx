"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { ResearchObjectStats as ResearchObjectStatsType } from "@/types/metrics";
import { DateFilterWithPresets } from "./DateFilterbar";
import { useQuery } from "@tanstack/react-query";
import { tags } from "@/lib/tags";
import { getResearchObjectMetrics } from "@/lib/api";
import { useGetFilter } from "@/contexts/FilterContext";
import { ErrorMessage } from "../ui/error-message";

export function ResearchObjectStats() {
  const { range, compareToPreviousPeriod } = useGetFilter();
  const {
    data: stats,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: [tags.roStats, range.from, range.to, compareToPreviousPeriod],
    queryFn: () =>
      getResearchObjectMetrics(
        range.from && {
          from: range.from.toISOString() ?? "",
          to: range.to?.toISOString() ?? "",
          compareToPreviousPeriod,
        }
      ),
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

  console.log("stats", stats);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-4">
        <p className="text-muted-foreground">
          Assess productivity and platform use by measuring creation rates among
          researchers.
        </p>
        <div className="flex items-center justify-end gap-3">
          <DateFilterWithPresets />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Average ROs per Researcher"
          value={stats?.averageRoCreatedPerUser ?? 0}
          valueFormat="number"
          description="Average number of research objects created per researcher"
          isLoading={isFetching}
          trend={
            compareToPreviousPeriod
              ? (stats?.averageRoCreatedPerUser ?? 0) -
                (stats?.previousPeriod?.averageRoCreatedPerUser ?? 0)
              : undefined
          }
        />
        <MetricCard
          title="Median ROs per Researcher"
          value={stats?.medianRoCreatedPerUser ?? 0}
          valueFormat="number"
          description="Median number of research objects created per researcher"
          isLoading={isFetching}
          trend={
            compareToPreviousPeriod
              ? (stats?.medianRoCreatedPerUser ?? 0) -
                (stats?.previousPeriod?.medianRoCreatedPerUser ?? 0)
              : undefined
          }
        />
        <MetricCard
          title="Total ROs Created"
          value={stats?.totalRoCreated ?? 0}
          valueFormat="number"
          description="Total number of research objects created"
          isLoading={isFetching}
          trend={
            compareToPreviousPeriod
              ? (stats?.totalRoCreated ?? 0) -
                (stats?.previousPeriod?.totalRoCreated ?? 0)
              : undefined
          }
        />
      </div>
    </div>
  );
}
