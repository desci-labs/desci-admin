import { Badge } from "@/components/custom/Badge";
import { LineChart } from "@/components/custom/LineChart";
import { overviews } from "@/data/analysis-data";
import { OverviewData } from "@/data/schema";
import { cn, formatters, getBadgeType, percentageFormatter } from "@/lib/utils";
import {
  eachDayOfInterval,
  formatDate,
  interval,
  isWithinInterval,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { getPeriod } from "@/lib/utils";
import { PeriodValue } from "@/lib/chartUtils";

export type CardProps = {
  title: keyof OverviewData;
  type: "currency" | "unit" | "data";
  selectedDates: DateRange | undefined;
  selectedPeriod: PeriodValue;
  isThumbnail?: boolean;
  xAxisLabel: string;
  yAxisLabel: string;
};

const formattingMap = {
  currency: formatters.currency,
  unit: formatters.unit,
  data: formatters.byte,
};

export function ChartCard({
  title,
  type,
  selectedDates,
  selectedPeriod,
  isThumbnail,
  xAxisLabel,
  yAxisLabel,
}: CardProps) {
  const formatter = formattingMap[type];
  const selectedDatesInterval =
    selectedDates?.from && selectedDates?.to
      ? interval(selectedDates.from, selectedDates.to)
      : null;
  const allDatesInInterval =
    selectedDates?.from && selectedDates?.to
      ? eachDayOfInterval(interval(selectedDates.from, selectedDates.to))
      : null;
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
      const value = (overview?.[title] as number) || null;
      const previousValue = (prevOverview?.[title] as number) || null;

      return {
        title,
        date: date,
        formattedDate: formatDate(date, "dd/MM/yyyy"),
        value,
        previousDate: prevOverview?.date,
        previousFormattedDate: prevOverview
          ? formatDate(prevOverview.date, "dd/MM/yyyy")
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
              {percentageFormatter(evolution)}
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
        className="mt-6 h-52"
        data={chartData || []}
        index="formattedDate"
        colors={["indigo", "gray"]}
        // startEndOnly={false}
        valueFormatter={(value) => formatter(value as number)}
        showYAxis={true}
        showLegend={true}
        xAxisLabel={xAxisLabel}
        yAxisLabel={yAxisLabel}
        categories={categories}
        showTooltip={isThumbnail ? false : true}
        autoMinValue
        // onValueChange={}
      />
    </div>
  );
}
