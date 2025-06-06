"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { RetentionMetrics as RetentionMetricsType } from "@/types/metrics";

export function RetentionMetrics() {
  const [metrics, setMetrics] = useState<RetentionMetricsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchMetrics = async () => {
      try {
        // Simulated API response
        const response = {
          day1Retention: 45,
          day7Retention: 30,
          day30Retention: 20,
          day365Retention: 10,
        };
        setMetrics(response);
      } catch (error) {
        console.error("Error fetching retention metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

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
          value={metrics?.day1Retention ?? 0}
          description="Users who returned the day after signup"
          isLoading={isLoading}
        />
        <MetricCard
          title="Day 7 Retention"
          value={metrics?.day7Retention ?? 0}
          description="Users who returned after 7 days"
          isLoading={isLoading}
        />
        <MetricCard
          title="Day 30 Retention"
          value={metrics?.day30Retention ?? 0}
          description="Users who returned after 30 days"
          isLoading={isLoading}
        />
        <MetricCard
          title="Day 365 Retention"
          value={metrics?.day365Retention ?? 0}
          description="Users who returned after 365 days"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
