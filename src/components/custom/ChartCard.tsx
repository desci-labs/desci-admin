import { Badge } from "@/components/custom/Badge";
import { LineChart } from "@/components/custom/LineChart";
import { AnalyticsData } from "@/data/schema";
import { cn, formatters, getBadgeType, percentageFormatter } from "@/lib/utils";
import {
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  formatDate,
  interval,
  isWithinInterval,
  eachHourOfInterval,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { getPeriod } from "@/lib/utils";
import { PeriodValue } from "@/lib/chartUtils";
import { useMemo } from "react";

export type CardProps = {
  categoryId: keyof AnalyticsData;
  title: string;
  type: "currency" | "unit" | "data";
  selectedDates: DateRange | undefined;
  selectedPeriod: PeriodValue;
  isThumbnail?: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
  interval: "hourly" | "daily" | "weekly" | "monthly" | "yearly";
  data: AnalyticsData[];
  loading: boolean;
};

const formattingMap = {
  currency: formatters.currency,
  unit: formatters.unit,
  data: formatters.byte,
};

export function ChartCard({
  categoryId,
  title,
  type,
  selectedDates,
  selectedPeriod,
  isThumbnail,
  xAxisLabel,
  yAxisLabel,
  interval: dataInterval,
  data: overviews,
  loading,
}: CardProps) {
  const formatter = formattingMap[type];
  const selectedDatesInterval =
    selectedDates?.from && selectedDates?.to
      ? interval(selectedDates.from, selectedDates.to)
      : null;

  const allDatesInInterval = useMemo(() => {
    switch (dataInterval) {
      case "hourly":
        return selectedDates?.from && selectedDates?.to
          ? eachHourOfInterval(interval(selectedDates.from, selectedDates.to))
          : null;
      case "daily":
        return selectedDates?.from && selectedDates?.to
          ? eachDayOfInterval(interval(selectedDates.from, selectedDates.to))
          : null;
      case "weekly":
        return selectedDates?.from && selectedDates?.to
          ? eachWeekOfInterval(interval(selectedDates.from, selectedDates.to))
          : null;
      case "monthly":
        return selectedDates?.from && selectedDates?.to
          ? eachMonthOfInterval(interval(selectedDates.from, selectedDates.to))
          : null;
      case "yearly":
        return selectedDates?.from && selectedDates?.to
          ? eachYearOfInterval(interval(selectedDates.from, selectedDates.to))
          : null;
      default:
        return selectedDates?.from && selectedDates?.to
          ? eachDayOfInterval(interval(selectedDates.from, selectedDates.to))
          : null;
    }
  }, [dataInterval, selectedDates?.from, selectedDates?.to]);

  const prevDates = getPeriod(selectedDates);
  const prevDatesInterval =
    prevDates?.from && prevDates?.to
      ? interval(prevDates.from, prevDates.to)
      : null;

  const data = overviews
    .filter((overview) => {
      if (selectedDatesInterval) {
        return isWithinInterval(overview.date, selectedDatesInterval);
      }
      return true;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const prevData = overviews
    .filter((overview) => {
      if (prevDatesInterval) {
        return isWithinInterval(overview.date, prevDatesInterval);
      }
      return false;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const chartData = allDatesInInterval
    ?.map((date, index) => {
      const overview = data[index];
      const prevOverview = prevData[index];
      const value = (overview?.[categoryId] as number) || null;
      const previousValue = (prevOverview?.[categoryId] as number) || null;

      return {
        title,
        date: date,
        formattedDate: formatDate(date, "dd MMM"),
        value,
        previousDate: prevOverview?.date,
        previousFormattedDate: prevOverview
          ? formatDate(prevOverview.date, "dd MMM")
          : null,
        previousValue:
          selectedPeriod !== "no-comparison" ? previousValue : null,
        evolution:
          selectedPeriod !== "no-comparison" && value && previousValue
            ? (value - previousValue) / previousValue
            : undefined,
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const categories =
    selectedPeriod === "no-comparison" ? ["value"] : ["value", "previousValue"];
  const value =
    chartData?.reduce((acc, item) => acc + (item.value || 0), 0) || 0;
  const previousValue =
    chartData?.reduce((acc, item) => acc + (item.previousValue || 0), 0) || 0;
  const evolution =
    selectedPeriod !== "no-comparison"
      ? (value - previousValue) / previousValue
      : 0;

  console.log("[categories]", { data, prevData, chartData });

  return (
    <div className={cn("transition")}>
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex items-center gap-x-2">
          <dt className="font-bold text-gray-900 sm:text-sm dark:text-gray-50">
            {title}
          </dt>
          {selectedPeriod !== "no-comparison" && (
            <Badge variant={getBadgeType(evolution)}>
              {percentageFormatter(Number.isNaN(evolution) ? 0 : evolution)}
            </Badge>
          )}
        </div>
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <dd className="text-xl text-gray-900 dark:text-gray-50">
          {formatter(value)}
        </dd>
        {selectedPeriod !== "no-comparison" && (
          <dd className="text-sm text-gray-500">
            from {formatter(previousValue)}
          </dd>
        )}
      </div>
      <LineChart
        className="mt-6 h-52 relative"
        data={chartData || []}
        index="formattedDate"
        colors={["indigo", "gray"]}
        startEndOnly={false}
        valueFormatter={(value) => formatter(value as number)}
        showYAxis={true}
        showLegend={true}
        xAxisLabel=""
        yAxisLabel={yAxisLabel}
        categories={categories}
        showTooltip={isThumbnail ? false : true}
        autoMinValue
        loading={loading}
        // onValueChange={}
      />
    </div>
  );
}
