"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getAnalytics } from "@/lib/api";
import { Activity, Box, HardDrive, LoaderIcon, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { getHeaders } from "@/lib/utils";

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
    const response = await fetch("/api/download", { credentials: "include", headers: getHeaders() });
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
      <div className="flex flex-col space-y-4 w-full">
        {/* <h1 className="text-2xl font-bold tracking-tight"></h1> */}
        <Button className="place-content-end self-end" onClick={downloadReport}>Download</Button>
        <div className="flex w-full">
          <Analytics />
        </div>
      </div>
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
const numberValue = (num: number) => (num > 0 ? `+${num}` : "0");

function Analytics() {
  const {
    data: analytics,
    isLoading,
    error,
    isError,
  } = useSuspenseQuery(getAnalytics);
  // console.log({ analytics, isLoading, isError, error });
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

  if (!analytics) return <IncomingFeature />;

  return (
    <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
          analytics.bytesInLast7Days ?? 0
        )}`}
        description="Last 7 days"
        icon="data"
      />
      <MetricCard
        header="Uploaded Data"
        value={`${byteValueNumberFormatter.format(
          analytics.bytesInLast30Days ?? 0
        )}`}
        description="Last 30 days"
        icon="data"
      />
    </div>
  );
}
