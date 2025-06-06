"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { ResearchObjectStats as ResearchObjectStatsType } from "@/types/metrics";
import { DateFilterWithPresets } from "./DateFilterbar";

export function ResearchObjectStats() {
  const [stats, setStats] = useState<ResearchObjectStatsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchStats = async () => {
      try {
        // Simulated API response
        const response = {
          averageROsPerResearcher: 5.2,
          medianROsPerResearcher: 3,
          totalROsCreated: 1250,
        };
        setStats(response);
      } catch (error) {
        console.error("Error fetching research object stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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
          value={stats?.averageROsPerResearcher ?? 0}
          description="Average number of research objects created per researcher"
          isLoading={isLoading}
        />
        <MetricCard
          title="Median ROs per Researcher"
          value={stats?.medianROsPerResearcher ?? 0}
          description="Median number of research objects created per researcher"
          isLoading={isLoading}
        />
        <MetricCard
          title="Total ROs Created"
          value={stats?.totalROsCreated ?? 0}
          description="Total number of research objects created"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
