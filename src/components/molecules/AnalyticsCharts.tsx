import { overviews } from "@/data/analysis-data";
import { AnalyticsData } from "@/data/schema";
import { subDays, toDate } from "date-fns";
import { Filterbar } from "./DateFilterbar";
import { DateRange } from "react-day-picker";
import { useEffect, useRef, useState } from "react";
import { ChartCard } from "../custom/ChartCard";
import { cn } from "@/lib/utils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAnalyticsData } from "@/lib/api";
import { tags } from "@/lib/tags";

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
//   {
//     id: "publishedNodes",
//     title: "Published nodes",
//     type: "unit",
//     xAxisLabel: "Date",
//     yAxisLabel: "Nodes",
//   },
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
  //   {
  //     title: "Downloaded data",
  //     type: "data",
  //     xAxisLabel: "Date",
  //     yAxisLabel: "Data downloaded",
  //   },
];

export type KpiEntry = {
  title: string;
  percentage: number;
  current: number;
  allowed: number;
  unit?: string;
};

const overviewsDates = overviews.map((item) => toDate(item.date).getTime());
const maxDate = new Date(); // toDate(Math.max(...overviewsDates));

export default function AnalyticsCharts() {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>({
    from: subDays(maxDate, 30),
    to: maxDate,
  });

  const {
    data = [],
    isLoading,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: [tags.analyticsChartData, selectedDates?.from, selectedDates?.to],
    queryFn: () => getAnalyticsData(selectedDates!),
  });

  const lastDataRef = useRef<AnalyticsData[]>([]);

  useEffect(() => {
    if (!isFetching && data.length > 0) {
      lastDataRef.current = data;
    }
  }, [isFetching, data]);

  return (
    <section aria-labelledby="analytics-charts">
      <div className="sticky top-16 z-20 flex items-center justify-between border-b border-gray-200 bg-white pb-4 pt-4 sm:pt-6 lg:top-0 lg:mx-0 lg:px-0 lg:pt-8 dark:border-gray-800 dark:bg-gray-950">
        <h1
          id="usage-overview"
          className="scroll-mt-8 text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50"
        >
          Analytic Charts
        </h1>
        <div className="sticky top-16 z-20 flex items-center justify-between ">
          <Filterbar
            maxDate={maxDate}
            minDate={new Date(2023, 0, 1)}
            selectedDates={selectedDates}
            onDatesChange={(dates) => setSelectedDates(dates)}
          />
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
              interval="daily"
              key={category.title}
              title={category.title}
              type={category.type}
              selectedDates={selectedDates}
              selectedPeriod="last-year"
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
