"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Users, UserPlus } from "lucide-react";
import { DateFilterWithPresets } from "./DateFilterbar";
import { tags } from "@/lib/tags";
import {
  getPublishingFunnelMetrics,
  getUserEngagementMetrics,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useGetFilter } from "@/contexts/FilterContext";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/ui/error-message";

interface MetricsData {
  publishers: number;
  publishersInCommunity: number;
  guestSignUpSuccessRate: number;
  growth?: {
    publishers: number;
    publishersInCommunity: number;
    guestSignUpSuccessRate: number;
  };
}

// async function getPublishingFunnelData(): Promise<PublishingFunnelData> {
//   // TODO: Implement actual data fetching
//   // This is a placeholder that returns mock data
//   return {
//     publishedResearchObjects: {
//       percentage: 65,
//       total: 130,
//     },
//     communityPublications: {
//       percentage: 45,
//       total: 90,
//     },
//     guestSignups: {
//       percentage: 30,
//       total: 60,
//     },
//   };
// }
const KpiTrend = ({ growth }: { growth: number }) => {
  return (
    <>
      {growth !== undefined && (
        <div
          className={`flex items-center text-sm ${
            growth > 0
              ? "text-green-600"
              : growth < 0
              ? "text-red-600"
              : "text-muted-foreground"
          }`}
        >
          {growth > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                clipRule="evenodd"
              />
            </svg>
          ) : growth < 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.285a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span className="ml-1">{Math.abs(growth)}%</span>
        </div>
      )}
    </>
  );
};
const KpiCard = ({
  title,
  description,
  value,
  icon: Icon,
  growth,
}: {
  title: string;
  description: string;
  value: number;
  icon: React.ElementType;
  growth?: number;
}) => {
  return (
    <Card className="transition-all duration-200 hover:border-blue-500/50 hover:shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2 justify-between">
          <div className="text-2xl font-bold">{value}%</div>
          {growth !== undefined && <KpiTrend growth={growth} />}
        </div>
      </CardContent>
    </Card>
  );
};

const KpiCardSkeleton = () => {
  return (
    <Card className="transition-all duration-200 hover:border-blue-500/50 hover:shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </CardContent>
    </Card>
  );
};

export default function PublishingFunnelMetrics() {
  const { range, compareToPreviousPeriod } = useGetFilter();
  const {
    data: metrics,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: [
      tags.publishingFunnel,
      range.from,
      range.to,
      compareToPreviousPeriod,
    ],
    queryFn: () =>
      getPublishingFunnelMetrics({
        from: range.from?.toISOString() ?? "",
        to: range.to?.toISOString() ?? "",
        compareToPreviousPeriod,
      }),
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

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between space-x-4">
        <p className="text-muted-foreground">
          Monitor user conversion from creation to publication and
          community-level participation.
        </p>
        <div className="flex items-center justify-end gap-3">
          <DateFilterWithPresets />
        </div>
      </div>

      {isFetching ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <KpiCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <KpiCard
            title="Published Research Objects"
            description="% of users who published a research object"
            value={metrics?.publishers ?? 0}
            icon={FileText}
            growth={
              compareToPreviousPeriod
                ? (metrics?.publishers ?? 0) -
                  (metrics?.previousPeriod?.publishers ?? 0)
                : undefined
            }
          />
          <KpiCard
            title="Community Publications"
            description="% of users who published in a community"
            value={metrics?.publishersInCommunity ?? 0}
            icon={Users}
            growth={
              compareToPreviousPeriod
                ? (metrics?.publishersInCommunity ?? 0) -
                  (metrics?.previousPeriod?.publishersInCommunity ?? 0)
                : undefined
            }
          />
          <KpiCard
            title="Guest Signups"
            description="% of unique guest users who sign up"
            value={metrics?.guestSignUpSuccessRate ?? 0}
            icon={UserPlus}
            growth={
              compareToPreviousPeriod
                ? (metrics?.guestSignUpSuccessRate ?? 0) -
                  (metrics?.previousPeriod?.guestSignUpSuccessRate ?? 0)
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
