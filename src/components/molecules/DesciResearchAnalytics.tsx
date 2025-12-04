"use client";

import { Filterbar } from "./DateFilterbar";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";
import { formatDate } from "date-fns";
import { toast } from "sonner";

import {
  TrendingDown,
  TrendingUp,
  MessageSquare,
  Users,
  BarChart3,
  Download,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface DataItem {
  date: string;
  value: string | number;
}

export interface SciweaveUserAnalytics {
  analytics: {
    date: string;
    value: number;
  }[];
  count: number;
  meta: {
    from: string;
    to: string;
    diffInDays: number;
  };
}

interface UserSessionsDataItem {
  date: Date;
  sessionCount: number;
  durationInSeconds: number;
}

interface DevicesDataItem {
  date: Date;
  mobile: number;
  tablet: number;
  mac: number;
  windows: number;
  otherDesktops: number;
  unknown: number;
}

interface EngagementStats {
  totalChats: number;
  activeUsers: number;
  followupPercentage: number;
  avgChatsPerUser: number;
  errorRate: number;
  totalQuestions: number;
  emptyResponses: number;
}

function ChartAreaDefault(props: {
  data: DataItem[];
  interval: "daily" | "weekly" | "monthly" | "yearly";
  selectedDates: DateRange;
  title: string;
  description: string;
  trend?: number;
  config: {
    value: {
      label: string;
      color: string;
    };
  };
}) {
  const chartData = useMemo(() => {
    return props.data.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: Number(item.value),
    }));
  }, [props.data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={props.config}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="value"
              type="natural"
              fill="var(--color-value)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              <span className="flex items-center gap-1 text-muted-foreground">
                {props.trend ? (
                  <>
                    {props.trend > 0 ? (
                      <>
                        Trending up by{" "}
                        <span className="text-green-500">{props.trend}%</span>{" "}
                        <TrendingUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Trending down by{" "}
                        <span className="text-red-500">{props.trend}%</span>{" "}
                        <TrendingDown className="h-4 w-4" />
                      </>
                    )}
                  </>
                ) : (
                  "No trend data available"
                )}
              </span>
            </div>
            {props.selectedDates.from && props.selectedDates.to && (
              <div className="text-muted-foreground flex items-center gap-2 leading-none">
                {formatDate(props.selectedDates.from, "dd MMM")} -{" "}
                {formatDate(props.selectedDates.to, "dd MMM")}
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

const devicesChartConfig = {
  visitors: {
    label: "Visitors",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-1)",
  },
  tablet: {
    label: "Tablet",
    color: "var(--chart-2)",
  },
  mac: {
    label: "Mac",
    color: "var(--chart-3)",
  },
  windows: {
    label: "Windows",
    color: "var(--chart-4)",
  },
  otherDesktops: {
    label: "Other Desktops",
    color: "var(--chart-5)",
  },
  unknown: {
    label: "Unknown",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig;

function ChartAreaInteractive(props: {
  data: DevicesDataItem[];
  interval: "daily" | "weekly" | "monthly" | "yearly";
  selectedDates: DateRange;
  title: string;
  description: string;
}) {
  const chartData = useMemo(() => {
    return props.data.map((item) => ({
      date: formatDate(item.date, "dd MMM"),
      mobile: item.mobile,
      tablet: item.tablet,
      mac: item.mac,
      windows: item.windows,
      otherDesktops: item.otherDesktops,
      unknown: item.unknown,
    }));
  }, [props.data]);

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={devicesChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTablet" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tablet)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tablet)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMac" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mac)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mac)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillWindows" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-windows)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-windows)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillOtherDesktops"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-otherDesktops)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-otherDesktops)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillUnknown" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-unknown)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-unknown)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="tablet"
              type="natural"
              fill="url(#fillTablet)"
              stroke="var(--color-tablet)"
              stackId="b"
            />
            <Area
              dataKey="mac"
              type="natural"
              fill="url(#fillMac)"
              stroke="var(--color-mac)"
              stackId="c"
            />
            <Area
              dataKey="windows"
              type="natural"
              fill="url(#fillWindows)"
              stroke="var(--color-windows)"
              stackId="d"
            />
            <Area
              dataKey="otherDesktops"
              type="natural"
              fill="url(#fillOtherDesktops)"
              stroke="var(--color-otherDesktops)"
              stackId="e"
            />
            <Area
              dataKey="unknown"
              type="natural"
              fill="url(#fillUnknown)"
              stroke="var(--color-unknown)"
              stackId="f"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function DesciResearchAnalytics({
  chats,
  uniqueUsers,
  userSessions,
  devices,
  selectedDates,
  interval,
  engagementStats,
  newUsers,
}: {
  chats: DataItem[];
  uniqueUsers: DataItem[];
  userSessions: UserSessionsDataItem[];
  devices: DevicesDataItem[];
  selectedDates: DateRange;
  interval: "daily" | "weekly" | "monthly" | "yearly";
  engagementStats: EngagementStats;
  newUsers: SciweaveUserAnalytics;
}) {
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!selectedDates.from || !selectedDates.to) {
      toast.warning("Please select a date range");
      return;
    }

    try {
      setIsExporting(true);
      const params = new URLSearchParams();
      params.set("from", selectedDates.from.toISOString());
      params.set("to", selectedDates.to.toISOString());
      params.set("interval", interval);

      const response = await fetch(
        `/api/sciweave-analytics/export?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export analytics");
      }

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = `sciweave-analytics-${interval}-${
        selectedDates.from.toISOString().split("T")[0]
      }-to-${selectedDates.to.toISOString().split("T")[0]}.csv`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(fileURL);

      toast.success("Analytics exported successfully", {
        description: "The file has been downloaded to your device.",
      });
    } catch (error) {
      console.error("Error exporting analytics:", error);
      toast.error("Failed to export analytics", {
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };
  const userSessionsData = useMemo(() => {
    return userSessions.map((item) => ({
      date: formatDate(item.date, "dd MMM"),
      value: item.sessionCount,
    }));
  }, [userSessions]);

  const userSessionsDurationData = useMemo(() => {
    return userSessions.map((item) => ({
      date: formatDate(item.date, "dd MMM"),
      value: item.durationInSeconds,
    }));
  }, [userSessions]);

  const newUsersData = useMemo(() => {
    return (
      newUsers?.analytics?.map((item) => ({
        date: formatDate(item.date, "dd MMM"),
        value: item.value,
      })) ?? []
    );
  }, [newUsers]);

  const trends = useMemo(() => {
    const chatsTrend =
      chats.length > 0 && Number(chats[0].value) > 0
        ? (Number(chats[chats.length - 1].value) - Number(chats[0].value)) /
          Number(chats[0].value)
        : 0;
    const uniqueUsersTrend =
      uniqueUsers.length > 0 && Number(uniqueUsers[0].value) > 0
        ? (Number(uniqueUsers[uniqueUsers.length - 1].value) -
            Number(uniqueUsers[0].value)) /
          Number(uniqueUsers[0].value)
        : 0;
    const userSessionsTrend =
      userSessions.length > 0 && Number(userSessions[0].sessionCount) > 0
        ? (Number(userSessions[userSessions.length - 1].sessionCount) -
            Number(userSessions[0].sessionCount)) /
          Number(userSessions[0].sessionCount)
        : 0;
    const userSessionsDurationTrend =
      userSessionsDurationData.length > 0 &&
      Number(userSessionsDurationData[0].value) > 0
        ? (Number(
            userSessionsDurationData[userSessionsDurationData.length - 1].value
          ) -
            Number(userSessionsDurationData[0].value)) /
          Number(userSessionsDurationData[0].value)
        : 0;
    const newUsersTrend =
      newUsersData.length > 0 && Number(newUsersData[0].value) > 0
        ? (Number(newUsersData[newUsersData.length - 1].value) -
            Number(newUsersData[0].value)) /
          Number(newUsersData[0].value)
        : 0;

    return {
      chats: Math.round(chatsTrend * 100),
      uniqueUsers: Math.round(uniqueUsersTrend * 100),
      userSessions: Math.round(userSessionsTrend * 100),
      userSessionsDuration: Math.round(userSessionsDurationTrend * 100),
      newUsers: Math.round(newUsersTrend * 100),
    };
  }, [
    chats,
    uniqueUsers,
    userSessions,
    userSessionsDurationData,
    newUsersData,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-4">
        <p className="text-muted-foreground">Desci Research Usage Analytics</p>
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting || !selectedDates.from || !selectedDates.to}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
          <Filterbar
            maxDate={new Date()}
            minDate={new Date(2022, 0, 1)}
            selectedDates={selectedDates}
            onDatesChange={(dates) => {
              if (!dates?.from || !dates?.to) {
                toast.warning("Please select a start and end date");
                return;
              }

              router.push(
                `/metrics/sciweave?from=${dates?.from?.toISOString()}&to=${dates?.to?.toISOString()}&interval=${interval}`
              );
            }}
          />
          <Select
            defaultValue={interval}
            onValueChange={(newInterval) => {
              router.push(
                `/metrics/sciweave?from=${selectedDates.from?.toISOString()}&to=${selectedDates.to?.toISOString()}&interval=${newInterval}`
              );
            }}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="px-2" value="daily">
                Day
              </SelectItem>
              <SelectItem className="px-2" value="weekly">
                Week
              </SelectItem>
              <SelectItem className="px-2" value="monthly">
                Month
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Engagement Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:border-btn-surface-primary-focus duration-150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground group-hover:text-btn-surface-primary-focus" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementStats.totalChats.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Within the time period
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:border-btn-surface-primary-focus duration-150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Follow-up Questions
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground group-hover:text-btn-surface-primary-focus" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementStats.followupPercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              % of users who write follow-up questions
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:border-btn-surface-primary-focus duration-150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground group-hover:text-btn-surface-primary-focus" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementStats?.activeUsers?.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique users who started a new chat
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:border-btn-surface-primary-focus duration-150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Chats per User
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground group-hover:text-btn-surface-primary-focus" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementStats.avgChatsPerUser.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average number of chats per user
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:border-btn-surface-primary-focus duration-150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground group-hover:text-btn-surface-primary-focus" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementStats?.errorRate?.toFixed(2) || "0.00"}%
            </div>
            <p className="text-xs text-muted-foreground">
              {engagementStats?.emptyResponses?.toLocaleString() || 0} empty
              responses out of{" "}
              {engagementStats?.totalQuestions?.toLocaleString() || 0} total
              questions
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:border-btn-surface-primary-focus duration-150">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <UserPlus className="w-4 h-4 text-muted-foreground group-hover:text-btn-surface-primary-focus" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newUsers?.count?.toString()}
            </div>
            <p className="text-xs text-muted-foreground">
              New users in the time period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ChartAreaDefault
          data={chats}
          trend={trends.chats}
          interval={interval}
          selectedDates={selectedDates}
          config={{
            value: {
              label: "Chats",
              color: "var(--chart-1)",
            },
          }}
          title="Chats"
          description="Showing chats activity over the selected period"
        />
        <ChartAreaDefault
          data={uniqueUsers}
          trend={trends.uniqueUsers}
          interval={interval}
          selectedDates={selectedDates}
          config={{
            value: {
              label: "Users",
              color: "var(--chart-1)",
            },
          }}
          title="Unique Users"
          description="Showing unique active users over the selected period"
        />
        <ChartAreaDefault
          data={newUsersData}
          trend={trends.newUsers}
          interval={interval}
          selectedDates={selectedDates}
          config={{
            value: {
              label: "New Users",
              color: "var(--chart-2)",
            },
          }}
          title="New Users"
          description="Showing new users over the selected period"
        />
        <ChartAreaDefault
          data={userSessionsData}
          trend={trends.userSessions}
          interval={interval}
          selectedDates={selectedDates}
          config={{
            value: {
              label: "Sessions",
              color: "var(--chart-3)",
            },
          }}
          title="User Sessions"
          description="User sessions for the selected period"
        />
        <ChartAreaDefault
          data={userSessionsDurationData}
          trend={trends.userSessionsDuration}
          interval={interval}
          selectedDates={selectedDates}
          config={{
            value: {
              label: "Duration",
              color: "var(--chart-3)",
            },
          }}
          title="User Sessions Duration"
          description="Average session duration for the selected period"
        />
      </div>
      <ChartAreaInteractive
        data={devices}
        interval={interval}
        selectedDates={selectedDates}
        title="Devices"
        description="Analysis of devices used in each sessions for the selected period"
      />
    </div>
  );
}
