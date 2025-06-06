import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Search } from "lucide-react";

interface MetricsData {
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  publishingUsers: {
    researchObjectsCreated: number;
    researchObjectsUpdated: number;
    researchObjectsShared: number;
    researchObjectsPublished: number;
    communityPublications: number;
  };
  exploringUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

async function getMetricsData(): Promise<MetricsData> {
  // TODO: Implement actual data fetching
  // This is a placeholder that returns mock data
  return {
    activeUsers: {
      daily: 150,
      weekly: 450,
      monthly: 1200,
    },
    publishingUsers: {
      researchObjectsCreated: 25,
      researchObjectsUpdated: 45,
      researchObjectsShared: 30,
      researchObjectsPublished: 15,
      communityPublications: 10,
    },
    exploringUsers: {
      daily: 300,
      weekly: 900,
      monthly: 2400,
    },
  };
}

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
export default async function UserEngagementMetrics() {
  const metricsData = await getMetricsData();

  return (
    <div className="container mx-auto py-6 space-y-6">
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
      </Tabs>
    </div>
  );
}
