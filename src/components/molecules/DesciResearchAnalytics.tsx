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
      date: formatDate(item.date, "dd MMM"),
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
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
              <span
                className={cn(
                  "flex items-center gap-1",
                  props.trend
                    ? props.trend > 0
                      ? "text-green-500"
                      : "text-red-500"
                    : "text-muted-foreground"
                )}
              >
                {props.trend ? (
                  <>
                    {props.trend > 0 ? (
                      <>
                        Trending up by {props.trend}% this period{" "}
                        <TrendingUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Trending down by {props.trend}% this period{" "}
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

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

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
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
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
          trend={10}
          interval={interval}
          selectedDates={selectedDates}
          config={{
            value: {
              label: "Chats",
              color: "var(--chart-1)",
            },
          }}
          title="Chats"
          description="Showing total chats for the selected date range"
        />
        <ChartAreaDefault
          data={uniqueUsers}
          trend={-5}
          interval={interval}
          selectedDates={selectedDates}
          config={{
            value: {
              label: "Users",
              color: "var(--chart-1)",
            },
          }}
          title="Unique Users"
          description="Showing total unique users for the selected date range"
        />
        <ChartAreaDefault
          data={userSessionsData}
          trend={-5}
          interval={interval}
          selectedDates={selectedDates}
          config={{
            value: {
              label: "Sessions",
              color: "var(--chart-3)",
            },
          }}
          title="User Sessions"
          description="Showing total user sessions for the selected date range"
        />
        <ChartAreaDefault
          data={userSessionsDurationData}
          trend={-5}
          interval={interval}
          selectedDates={selectedDates}
          config={{
            value: {
              label: "Duration",
              color: "var(--chart-2)",
            },
          }}
          title="User Sessions Duration"
          description="Showing average user sessions duration for the selected date range"
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
