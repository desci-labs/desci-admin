"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserEngagementMetrics } from "@/lib/api";
import { tags } from "@/lib/tags";
import { UserEngagementMetricsData } from "@/types/metrics";
import { useQuery } from "@tanstack/react-query";
import { Users, FileText, Search } from "lucide-react";

const KpiCard = ({
  title,
  description,
  value,
}: {
  title: string;
  description: string;
  value: number;
}) => {
  return (
    <Card className="transition-all duration-200 hover:border-blue-500/50 hover:shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

const MetricsSkeleton = () => {
  return (
    <div className="container space-y-6">
      <Skeleton className="h-4 w-3/4" />
      <Tabs defaultValue="active-users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active-users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Active Users
          </TabsTrigger>
          <TabsTrigger
            value="publishing-users"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Publishing Users
          </TabsTrigger>
          <TabsTrigger
            value="exploring-users"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Exploring Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active-users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="transition-all duration-200">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="publishing-users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="transition-all duration-200">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exploring-users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="transition-all duration-200">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function UserEngagementMetrics() {
  const {
    data: metricsData,
    isLoading,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: [tags.userEngagement],
    queryFn: () => getUserEngagementMetrics(),
  });

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  if (isLoading || isFetching) {
    return <MetricsSkeleton />;
  }

  return (
    <div className="container space-y-6">
      <p className="text-muted-foreground">
        Monitor user conversion from creation to publication and community-level
        participation.
      </p>
      <Tabs defaultValue="active-users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active-users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Active Users
          </TabsTrigger>
          <TabsTrigger
            value="publishing-users"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Publishing Users
          </TabsTrigger>
          <TabsTrigger
            value="exploring-users"
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Exploring Users
          </TabsTrigger>
        </TabsList>

        {metricsData && (
          <>
            <TabsContent value="active-users" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <KpiCard
                  title="Daily Active Users (DAU)"
                  description="Users active in the past 24 hours"
                  value={metricsData.activeUsers.daily}
                />
                <KpiCard
                  title="Weekly Active Users (WAU)"
                  description="Users active in the past 7 days"
                  value={metricsData.activeUsers.weekly}
                />
                <KpiCard
                  title="Monthly Active Users (MAU)"
                  description="Users active in the past 30 days"
                  value={metricsData.activeUsers.monthly}
                />
              </div>
            </TabsContent>

            <TabsContent value="publishing-users" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <KpiCard
                  title="Research Objects Created"
                  description="New research objects created"
                  value={metricsData.publishingUsers.researchObjectsCreated}
                />
                <KpiCard
                  title="Research Objects Updated"
                  description="Research objects with recent updates"
                  value={metricsData.publishingUsers.researchObjectsUpdated}
                />
                <KpiCard
                  title="Research Objects Shared"
                  description="Research objects shared with others"
                  value={metricsData.publishingUsers.researchObjectsShared}
                />
                <KpiCard
                  title="Research Objects Published"
                  description="Research objects made public"
                  value={metricsData.publishingUsers.researchObjectsPublished}
                />
                <KpiCard
                  title="Community Publications"
                  description="New community publications created"
                  value={metricsData.publishingUsers.communityPublications}
                />
              </div>
            </TabsContent>

            <TabsContent value="exploring-users" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <KpiCard
                  title="Daily Exploring Users"
                  description="Users exploring content in the past 24 hours"
                  value={metricsData.exploringUsers.daily}
                />
                <KpiCard
                  title="Weekly Exploring Users"
                  description="Users exploring content in the past 7 days"
                  value={metricsData.exploringUsers.weekly}
                />
                <KpiCard
                  title="Monthly Exploring Users"
                  description="Users exploring content in the past 30 days"
                  value={metricsData.exploringUsers.monthly}
                />
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {!metricsData && <div>No data available</div>}
    </div>
  );
}
