"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { FeatureAdoptionMetrics as FeatureAdoptionMetricsType } from "@/types/metrics";
import { DateFilterWithPresets } from "./DateFilterbar";
import { useGetFilter } from "@/contexts/FilterContext";
import { useQuery } from "@tanstack/react-query";
import { getFeatureAdoptionMetrics } from "@/lib/api";
import { tags } from "@/lib/tags";
import { ErrorMessage } from "../ui/error-message";

export function FeatureAdoptionMetrics() {
  const { range, compareToPreviousPeriod } = useGetFilter();
  const {
    data: metrics,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: [tags.roStats, range.from, range.to, compareToPreviousPeriod],
    queryFn: () =>
      getFeatureAdoptionMetrics(
        range.from
          ? { from: range.from, to: range.to, compareToPreviousPeriod }
          : undefined
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

  // console.log("metrics", metrics);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <p className="text-muted-foreground">
          Track usage of specific product features to evaluate visibility,
          usefulness, and adoption over time.
        </p>
        <div className="flex items-center justify-end gap-3">
          <DateFilterWithPresets />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Total Shares"
          value={metrics?.totalShares ?? 0}
          valueFormat="number"
          trend={
            compareToPreviousPeriod
              ? Math.round(
                  ((metrics?.totalShares ?? 0) -
                    (metrics?.previousPeriod?.totalShares ?? 0)) /
                    (metrics?.previousPeriod?.totalShares || 1)
                )
              : undefined
          }
          description="Total number of research object shares"
          isLoading={isFetching}
        />
        <MetricCard
          title="Co-author Invites"
          value={metrics?.totalCoAuthorInvites ?? 0}
          valueFormat="number"
          trend={
            compareToPreviousPeriod
              ? Math.round(
                  ((metrics?.totalCoAuthorInvites ?? 0) -
                    (metrics?.previousPeriod?.totalCoAuthorInvites ?? 0)) /
                    (metrics?.previousPeriod?.totalCoAuthorInvites ?? 1)
                )
              : undefined
          }
          description="Total number of co-author invitations sent"
          isLoading={isFetching}
        />
        <MetricCard
          title="AI Analytics Clicks"
          value={metrics?.totalAIAnalyticsClicks ?? 0}
          valueFormat="number"
          trend={
            compareToPreviousPeriod
              ? Math.round(
                  ((metrics?.totalAIAnalyticsClicks ?? 0) -
                    (metrics?.previousPeriod?.totalAIAnalyticsClicks ?? 0)) /
                    (metrics?.previousPeriod?.totalAIAnalyticsClicks || 1)
                )
              : undefined
          }
          description="Total number of AI analytics tab clicks"
          isLoading={isFetching}
        />
        <MetricCard
          title="Matched Article Clicks"
          value={metrics?.totalMatchedArticleClicks ?? 0}
          valueFormat="number"
          trend={
            compareToPreviousPeriod
              ? Math.round(
                  ((metrics?.totalMatchedArticleClicks ?? 0) -
                    (metrics?.previousPeriod?.totalMatchedArticleClicks ?? 0)) /
                    (metrics?.previousPeriod?.totalMatchedArticleClicks || 1)
                )
              : undefined
          }
          description="Total clicks on closely matched articles"
          isLoading={isFetching}
        />
        <MetricCard
          title="Claimed Badges"
          value={metrics?.totalClaimedBadges ?? 0}
          valueFormat="number"
          trend={
            compareToPreviousPeriod
              ? Math.round(
                  ((metrics?.totalClaimedBadges ?? 0) -
                    (metrics?.previousPeriod?.totalClaimedBadges ?? 0)) /
                    (metrics?.previousPeriod?.totalClaimedBadges || 1)
                )
              : undefined
          }
          description="Total number of badges claimed by users"
          isLoading={isFetching}
        />
        <MetricCard
          title="Profile Views"
          value={metrics?.totalProfileViews ?? 0}
          valueFormat="number"
          trend={
            compareToPreviousPeriod
              ? Math.round(
                  ((metrics?.totalProfileViews ?? 0) -
                    (metrics?.previousPeriod?.totalProfileViews ?? 0)) /
                    (metrics?.previousPeriod?.totalProfileViews || 1)
                )
              : undefined
          }
          description="Total number of profile views"
          isLoading={isFetching}
        />
        <MetricCard
          title="Guest Mode Visits"
          value={metrics?.totalGuestModeVisits ?? 0}
          valueFormat="number"
          trend={
            compareToPreviousPeriod
              ? Math.round(
                  ((metrics?.totalGuestModeVisits ?? 0) -
                    (metrics?.previousPeriod?.totalGuestModeVisits ?? 0)) /
                    (metrics?.previousPeriod?.totalGuestModeVisits || 1)
                )
              : undefined
          }
          description="Total number of unique guest mode visits"
          isLoading={isFetching}
        />
      </div>
    </div>
  );
}
