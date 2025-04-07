import { AnalyticsData } from "@/data/schema";
import { endOfDay, formatDate, subDays, toDate } from "date-fns";
import { Filterbar } from "./DateFilterbar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DateRange } from "react-day-picker";
import { useEffect, useRef, useState } from "react";
import { ChartCard } from "../custom/ChartCard";
import { cn, getPeriod } from "@/lib/utils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAnalyticsData } from "@/lib/api";
import { tags } from "@/lib/tags";
import { PeriodValue } from "@/lib/chartUtils";

const categories: {
  id: keyof AnalyticsData;
  title: string;
  type: "currency" | "unit" | "data";
  xAxisLabel: string;
  yAxisLabel: string;
}[] = [
  {
    id: "newUsers",
    title: "New users",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "No of Users",
  },
  {
    id: "newOrcidUsers",
    title: "New orcid users",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Users",
  },
  {
    id: "activeUsers",
    title: "Active users",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Users",
  },
  {
    id: "activeOrcidUsers",
    title: "Active orcid users",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Users",
  },
  {
    id: "newNodes",
    title: "New nodes",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Nodes",
  },
  {
    id: "publishedNodes",
    title: "Published nodes",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Nodes",
  },
  {
    id: "nodeViews",
    title: "Node views",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Nodes",
  },
  {
    id: "bytes",
    title: "Uploaded data",
    type: "data",
    xAxisLabel: "Date",
    yAxisLabel: "Data Uploaded",
  },
  {
    id: "downloadedBytes",
    title: "Downloaded data",
    type: "data",
    xAxisLabel: "Date",
    yAxisLabel: "Data downloaded",
  },
];

export type KpiEntry = {
  title: string;
  percentage: number;
  current: number;
  allowed: number;
  unit?: string;
};

type Interval = "daily" | "weekly" | "monthly" | "yearly";

// const overviewsDates = overviews.map((item) => toDate(item.date).getTime());
const maxDate = new Date(); // toDate(Math.max(...overviewsDates));

export default function AnalyticsCharts(props: {
  onQueryChange: (props: {
    from: string;
    to: string;
    interval?: string;
  }) => void;
}) {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>({
    from: subDays(maxDate, 30),
    to: endOfDay(maxDate),
  });
  const [interval, setInterval] = useState<Interval>("weekly");
  const [periodValue, setPeriodValue] =
    useState<PeriodValue>("previous-period");

  const {
    data = [],
    isLoading,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: [
      tags.analyticsChartData,
      selectedDates?.from,
      selectedDates?.to,
      interval,
    ],
    queryFn: () => getAnalyticsData(selectedDates!, interval),
  });

  const lastDataRef = useRef<AnalyticsData[]>([]);

  useEffect(() => {
    if (!isFetching && data.length > 0) {
      lastDataRef.current = data;
    }
  }, [isFetching, data]);

  useEffect(() => {
    if (selectedDates?.from && selectedDates?.to) {
      console.log("[analyticsCharts]", selectedDates);
      props.onQueryChange({
        from: selectedDates.from.toISOString(),
        to: endOfDay(selectedDates.to).toISOString(),
        interval,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDates?.from, selectedDates?.to, interval]);

  const prevDates = getPeriod(selectedDates);

  console.log("[selectedDates]: ", selectedDates);
  return (
    <section aria-labelledby="analytics-charts">
      <div className="sticky top-16 z-20 flex items-center justify-between border-b border-gray-200 pb-4 pt-4 sm:pt-6 lg:top-0 lg:mx-0 lg:px-0 lg:pt-8 dark:border-gray-800 ">
        <h1
          id="usage-overview"
          className="scroll-mt-8 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Analytic Charts
        </h1>
        <div className="flex items-center justify-end space-x-4">
          <div className="flex items-center justify-start gap-3">
            <Filterbar
              maxDate={maxDate}
              minDate={new Date(2022, 0, 1)}
              selectedDates={selectedDates}
              onDatesChange={(dates) =>
                setSelectedDates({
                  from: dates?.from,
                  // to: dates?.to,
                  to: endOfDay(dates?.to ?? Date.now()),
                })
              }
            />
            <p className="text-muted-foreground text-sm">Compared to</p>
            <Select
              defaultValue={periodValue}
              onValueChange={(period) => setPeriodValue(period as PeriodValue)}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  className="px-2"
                  value="previous-period"
                  title={`${formatDate(
                    prevDates?.from ?? "",
                    "MMM dd, yyyy"
                  )} - ${formatDate(prevDates?.to ?? "", "MMM dd, yyyy")}`}
                >
                  Previous period
                </SelectItem>
                <SelectItem className="px-2" value="no-comparison">
                  No comparison
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select
            defaultValue={interval}
            onValueChange={(interval) => setInterval(interval as Interval)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* <SelectLabel>Select Interval</SelectLabel> */}
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <dl
        className={cn(
          "mt-10 grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-2 2xl:grid-cols-3"
        )}
      >
        {categories.map((category) => {
          return (
            <ChartCard
              categoryId={category.id}
              loading={isLoading || isFetching}
              interval={interval}
              key={category.title}
              title={category.title}
              type={category.type}
              selectedDates={selectedDates}
              selectedPeriod={periodValue}
              xAxisLabel={category.xAxisLabel}
              yAxisLabel={category.yAxisLabel}
              data={isFetching ? lastDataRef.current : data}
            />
          );
        })}
      </dl>
    </section>
  );
}
