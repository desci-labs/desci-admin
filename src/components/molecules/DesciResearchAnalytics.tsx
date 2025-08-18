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
import { formatDate, startOfDay } from "date-fns";
import { endOfDay } from "date-fns";
import { toast } from "sonner";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface DataItem {
  date: string;
  value: string | number;
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

function ChartAreaDefault(props: {
  data: DataItem[];
  interval: "day" | "week" | "month";
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
              // tickFormatter={(value) => formatDate(value, "dd MMM")}
            />
            {/* <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            /> */}
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
  interval: "day" | "week" | "month";
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
            {/* <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            /> */}
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
}: {
  chats: DataItem[];
  uniqueUsers: DataItem[];
  userSessions: UserSessionsDataItem[];
  devices: DevicesDataItem[];
  selectedDates: DateRange;
  interval: "day" | "week" | "month";
}) {
  const router = useRouter();
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

  const trends = useMemo(() => {
    const chatsTrend =
      (Number(chats[chats.length - 1].value) - Number(chats[0].value)) /
      Number(chats[0].value);
    const uniqueUsersTrend =
      (Number(uniqueUsers[uniqueUsers.length - 1].value) -
        Number(uniqueUsers[0].value)) /
      Number(uniqueUsers[0].value);
    const userSessionsTrend =
      (Number(userSessions[userSessions.length - 1].sessionCount) -
        Number(userSessions[0].sessionCount)) /
      Number(userSessions[0].sessionCount);
    const userSessionsDurationTrend =
      (Number(
        userSessionsDurationData[userSessionsDurationData.length - 1].value
      ) -
        Number(userSessionsDurationData[0].value)) /
      Number(userSessionsDurationData[0].value);

    return {
      chats: Math.round(chatsTrend * 100),
      uniqueUsers: Math.round(uniqueUsersTrend * 100),
      userSessions: Math.round(userSessionsTrend * 100),
      userSessionsDuration: Math.round(userSessionsDurationTrend * 100),
    };
  }, [chats, uniqueUsers, userSessions, userSessionsDurationData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-x-4">
        <p className="text-muted-foreground">Desci Research Usage Analytics</p>
        <div className="flex items-center justify-end gap-3">
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
                `/metrics/desci-research?from=${dates?.from?.toISOString()}&to=${dates?.to?.toISOString()}&interval=${interval}`
              );
            }}
          />
          {/* <p className="text-muted-foreground text-sm">Compared to</p> */}
          <Select
            defaultValue={interval}
            onValueChange={(newInterval) => {
              router.push(
                `/metrics/desci-research?from=${selectedDates.from?.toISOString()}&to=${selectedDates.to?.toISOString()}&interval=${newInterval}`
              );
            }}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className="px-2" value="day">
                Day
              </SelectItem>
              <SelectItem className="px-2" value="week">
                Week
              </SelectItem>
              <SelectItem className="px-2" value="month">
                Month
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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
              color: "var(--chart-2)",
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
