"use client";
import { MetricCard } from "./MetricCard";
import { DateFilterWithPresets } from "./DateFilterbar";
import { useQuery } from "@tanstack/react-query";
import { tags } from "@/lib/tags";
import { getResearchObjectMetrics } from "@/lib/api";
import { useGetFilter } from "@/contexts/FilterContext";
import { ErrorMessage } from "../ui/error-message";
import { formatters, getTrend } from "@/lib/utils";

export function ResearchObjectStats() {
  const { range, compareToPreviousPeriod } = useGetFilter();
  const {
    data: stats,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: [
      tags.researchObjectMetrics,
      range.from,
      range.to,
      compareToPreviousPeriod,
    ],
    queryFn: () =>
      getResearchObjectMetrics(
        range.from
          ? {
              from: range.from.toISOString() ?? "",
              to: range.to?.toISOString() ?? "",
              compareToPreviousPeriod,
            }
          : undefined
      ),
    retry: 2,
    retryDelay: (failureCount, error) => {
      return failureCount * 1000;
    },
  });

  const formatter = formatters.unit;

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
          value={formatter(stats?.averageRoCreatedPerUser ?? 0)}
          description="Average number of research objects created per researcher"
          isLoading={isFetching}
          trend={
            compareToPreviousPeriod
              ? getTrend(
                  stats?.averageRoCreatedPerUser ?? 0,
                  stats?.previousPeriod?.averageRoCreatedPerUser ?? 0
                )
              : undefined
          }
        />
        <MetricCard
          title="Median ROs per Researcher"
          value={formatter(stats?.medianRoCreatedPerUser ?? 0)}
          description="Median number of research objects created per researcher"
          isLoading={isFetching}
          trend={
            compareToPreviousPeriod
              ? getTrend(
                  stats?.medianRoCreatedPerUser ?? 0,
                  stats?.previousPeriod?.medianRoCreatedPerUser ?? 0
                )
              : undefined
          }
        />
        <MetricCard
          title="Total ROs Created"
          value={formatter(stats?.totalRoCreated ?? 0)}
          description="Total number of research objects created"
          isLoading={isFetching}
          trend={
            compareToPreviousPeriod
              ? getTrend(
                  stats?.totalRoCreated ?? 0,
                  stats?.previousPeriod?.totalRoCreated ?? 0
                )
              : undefined
          }
        />
      </div>
    </div>
  );
}
