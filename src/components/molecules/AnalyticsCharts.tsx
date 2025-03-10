import { overviews } from "@/data/analysis-data";
import { OverviewData } from "@/data/schema";
import { subDays, toDate } from "date-fns";
import { Filterbar } from "./DateFilterbar";
import { DateRange } from "react-day-picker";
import { useState } from "react";
import { ChartCard } from "../custom/ChartCard";
import { cn } from "@/lib/utils";

const categories: {
  title: keyof OverviewData;
  type: "currency" | "unit" | "data";
  xAxisLabel: string;
  yAxisLabel: string;
}[] = [
  {
    title: "New users",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "No of Users",
  },
  {
    title: "New orcid users",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Users",
  },
  {
    title: "Active users",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Users",
  },
  {
    title: "Active orcid users",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Users",
  },
  {
    title: "New nodes",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Nodes",
  },
  {
    title: "Published nodes",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Nodes",
  },
  {
    title: "Node views",
    type: "unit",
    xAxisLabel: "Date",
    yAxisLabel: "Nodes",
  },
  {
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
const maxDate = toDate(Math.max(...overviewsDates));

export default function AnalyticsCharts() {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>({
    from: subDays(maxDate, 30),
    to: maxDate,
  });

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
            minDate={new Date(2024, 0, 1)}
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
              key={category.title}
              title={category.title}
              type={category.type}
              selectedDates={selectedDates}
              selectedPeriod={"last-year"}
              xAxisLabel={category.xAxisLabel}
              yAxisLabel={category.yAxisLabel}
            />
          );
        })}
      </dl>
    </section>
  );
}
