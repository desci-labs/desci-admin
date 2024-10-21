"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "./Overview";
import { RecentSales } from "./RecentSales";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api";
import { Activity, Box, HardDrive, LoaderIcon, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function IncomingFeature() {
  const router = useRouter();
  return (
    <div className="h-3/6">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">404</h1>
        <span className="font-medium">Oops! Feature Not Implemented yet!</span>
        <p className="text-center text-muted-foreground">
          It seems like the page you&apos;re looking for <br />
          is not ready, create an issue on github to request for features
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button onClick={() => router.push("/")}>Back to Home</Button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  
  const downloadReport = async () => {
    const response = await fetch("/api/download", { credentials: "include" });
    const blob = await response.blob();
    const fileURL = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = fileURL;
    downloadLink.download = "report.csv";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(fileURL);
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <h1 className="text-2xl font-bold tracking-tight"></h1>
        <div className="flex items-center space-x-2">
          <Button
            onClick={downloadReport}
          >
            Download
          </Button>
        </div>
      </div>
      <Tabs
        orientation="vertical"
        defaultValue="analytics"
        className="space-y-4"
      >
        <div className="w-full overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Subscriptions
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <Card className="col-span-1 lg:col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  You made 265 sales this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Analytics />
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <IncomingFeature />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <IncomingFeature />
        </TabsContent>
      </Tabs>
    </>
  );
}

const metricIcons = {
  activity: Activity,
  users: UsersRound,
  nodes: Box,
  data: HardDrive,
} as const;

const MetricCard = ({
  header,
  value,
  description,
  icon = "users",
}: {
  header: string;
  value: string;
  description: string;
  activity?: boolean;
  icon?: keyof typeof metricIcons;
}) => {
  const Icons = metricIcons[icon];
  return (
    <Card className="group hover:border-btn-surface-primary-focus duration-150">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{header}</CardTitle>
        <Icons className="w-4 h-4 text-muted-foreground group-hover:text-btn-surface-primary-focus" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
const numberValue = (num: number) => num > 0 ? `+${num}` : '0';

function Analytics() {
  const { data: analytics, isLoading, error, isError } = useSuspenseQuery(getAnalytics);
  console.log({ analytics, isLoading, isError, error})
  const byteValueNumberFormatter = Intl.NumberFormat("en", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <LoaderIcon className="w-8 h-8" />
      </div>
    );

    if (!analytics) return <IncomingFeature />


  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        header="New users"
        value={numberValue(analytics.newUsersToday)}
        description="Today"
      />
      <MetricCard
        header="New users"
        value={numberValue(analytics.newUsersInLast7Days)}
        description="Last 7 days"
      />
      <MetricCard
        header="New users"
        value={numberValue(analytics.newUsersInLast30Days)}
        description="Last 30 days"
      />
      <MetricCard
        header="Active users"
        value={numberValue(analytics.activeUsersToday)}
        description="Today"
        icon="activity"
      />
      <MetricCard
        header="Active users"
        value={numberValue(analytics.activeUsersInLast7Days)}
        description="Last 7 days"
        icon="activity"
      />
      <MetricCard
        header="Active users"
        value={numberValue(analytics.activeUsersInLast30Days)}
        description="Last 30 days"
        icon="activity"
      />
      <MetricCard
        header="New Nodes"
        value={numberValue(analytics.newNodesToday)}
        description="Today"
        icon="nodes"
      />
      <MetricCard
        header="New Nodes"
        value={numberValue(analytics.newNodesInLast7Days)}
        description="Last 7 days"
        icon="nodes"
      />
      <MetricCard
        header="New Nodes"
        value={numberValue(analytics.newNodesInLast30Days)}
        description="Last 30 days"
        icon="nodes"
      />
      <MetricCard
        header="Node views"
        value={numberValue(analytics.nodeViewsToday)}
        description="Today"
        icon="nodes"
      />
      <MetricCard
        header="Node views"
        value={numberValue(analytics.nodeViewsInLast7Days)}
        description="Last 7 days"
        icon="nodes"
      />
      <MetricCard
        header="Node views"
        value={numberValue(analytics.nodeViewsInLast30Days)}
        description="Last 30 days"
        icon="nodes"
      />
      <MetricCard
        header="Uploaded Data"
        value={`${byteValueNumberFormatter.format(analytics.bytesToday ?? 0)}`}
        description="Today"
        icon="data"
      />
      <MetricCard
        header="Uploaded Data"
        value={`${byteValueNumberFormatter.format(
          analytics.bytesInLast7Days
        )}`}
        description="Last 7 days"
        icon="data"
      />
      <MetricCard
        header="Uploaded Data"
        value={`${byteValueNumberFormatter.format(
          analytics.bytesInLast30Days
        )}`}
        description="Last 30 days"
        icon="data"
      />
    </div>
  );
}
