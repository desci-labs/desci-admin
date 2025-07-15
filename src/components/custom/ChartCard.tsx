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
  startOfDay,
  endOfDay,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { getPeriod } from "@/lib/utils";
import { PeriodValue } from "@/lib/chartUtils";
import { useMemo } from "react";
import { SparkAreaChart } from "./SparkAreaChart";

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

const zeropad = (value: number) => value.toString().padStart(2, "0");

const transformDatesToUtc = (dates: DateRange | undefined) => {
  if (!dates || !dates.from || !dates.to) return undefined;

  const selectedRange = {
    from: `${dates?.from?.getFullYear()}-${zeropad(
      dates?.from?.getMonth()! + 1
    )}-${zeropad(dates?.from?.getDate()!)}T00:00:00.000Z`,
    to: `${dates?.to?.getFullYear()}-${zeropad(
      dates?.to?.getMonth()! + 1
    )}-${zeropad(dates?.to?.getDate()!)}T23:59:59.000Z`,
  };

  return selectedRange;
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

  const selectedRange = transformDatesToUtc(selectedDates);

  const selectedDatesInterval =
    selectedRange?.from && selectedRange?.to
      ? interval(selectedRange.from, selectedRange.to)
      : null;

  const allDatesInInterval = useMemo(() => {
    switch (dataInterval) {
      case "hourly":
        return selectedRange?.from && selectedRange?.to
          ? eachHourOfInterval(interval(selectedRange.from, selectedRange.to))
          : null;
      case "daily":
        return selectedRange?.from && selectedRange?.to
          ? eachDayOfInterval(interval(selectedRange.from, selectedRange.to))
          : null;
      case "weekly":
        return selectedRange?.from && selectedRange?.to
          ? eachWeekOfInterval(interval(selectedRange.from, selectedRange.to))
          : null;
      case "monthly":
        return selectedRange?.from && selectedRange?.to
          ? eachMonthOfInterval(interval(selectedRange.from, selectedRange.to))
          : null;
      case "yearly":
        return selectedRange?.from && selectedRange?.to
          ? eachYearOfInterval(interval(selectedRange.from, selectedRange.to))
          : null;
      default:
        return selectedRange?.from && selectedRange?.to
          ? eachDayOfInterval(interval(selectedRange.from, selectedRange.to))
          : null;
    }
  }, [dataInterval, selectedRange?.from, selectedRange?.to]);

  const prevPeriod = getPeriod(selectedDates);
  const prevDates = transformDatesToUtc(prevPeriod);
  const prevDatesInterval =
    prevDates?.from && prevDates?.to
      ? interval(prevDates.from, prevDates.to)
      : null;

  const data = overviews
    .filter((overview) => {
      if (selectedDatesInterval) {
        return isWithinInterval(overview.date, {
          start: selectedDatesInterval.start.toISOString().split("GMT")[0],
          end: selectedDatesInterval.end.toISOString().split("GMT")[0],
        });
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
      const value = (overview?.[categoryId] as number) || 0;
      const previousValue = (prevOverview?.[categoryId] as number) || 0;

      const peggedPeriod = isWithinInterval(
        date,
        interval(selectedRange?.from!, selectedRange?.to!)
      )
        ? date
        : new Date(selectedRange?.from!);

      console.log("[overview.date]", index, overview, date, peggedPeriod);
      return {
        title,
        date: overview?.date ?? peggedPeriod,
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
      {/* <SparkAreaChart
        className="mt-6 h-52 relative"
        data={chartData || []}
        index="formattedDate"
        colors={["indigo", "gray"]}
        // startEndOnly={false}
        // valueFormatter={(value: any) => formatter(value as number)}
        barCategoryGap='percent'
        showYAxis={true}
        showLegend={true}
        xAxisLabel=""
        yAxisLabel={yAxisLabel}
        categories={categories}
        showTooltip={isThumbnail ? false : true}
        autoMinValue
        loading={loading}
        // onValueChange={}
      /> */}
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
