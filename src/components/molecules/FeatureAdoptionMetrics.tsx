"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { FeatureAdoptionMetrics as FeatureAdoptionMetricsType } from "@/types/metrics";
import { DateFilterWithPresets } from "./DateFilterbar";

export function FeatureAdoptionMetrics() {
  const [metrics, setMetrics] = useState<FeatureAdoptionMetricsType | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchMetrics = async () => {
      try {
        // Simulated API response
        const response = {
          totalShares: 500,
          totalCoAuthorInvites: 100,
          totalAIAnalyticsClicks: 300,
          totalMatchedArticleClicks: 30,
          totalClaimedBadges: -50,
          totalProfileViews: 100,
          totalGuestModeVisits: 120,
        };
        setMetrics(response);
      } catch (error) {
        console.error("Error fetching feature adoption metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

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
          description="Total number of research object shares"
          isLoading={isLoading}
        />
        <MetricCard
          title="Co-author Invites"
          value={metrics?.totalCoAuthorInvites ?? 0}
          description="Total number of co-author invitations sent"
          isLoading={isLoading}
        />
        <MetricCard
          title="AI Analytics Clicks"
          value={metrics?.totalAIAnalyticsClicks ?? 0}
          description="Total number of AI analytics tab clicks"
          isLoading={isLoading}
        />
        <MetricCard
          title="Matched Article Clicks"
          value={metrics?.totalMatchedArticleClicks ?? 0}
          description="Total clicks on closely matched articles"
          isLoading={isLoading}
        />
        <MetricCard
          title="Claimed Badges"
          value={metrics?.totalClaimedBadges ?? 0}
          description="Total number of badges claimed by users"
          isLoading={isLoading}
        />
        <MetricCard
          title="Profile Views"
          value={metrics?.totalProfileViews ?? 0}
          description="Total number of profile views"
          isLoading={isLoading}
        />
        <MetricCard
          title="Guest Mode Visits"
          value={metrics?.totalGuestModeVisits ?? 0}
          description="Total number of unique guest mode visits"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
