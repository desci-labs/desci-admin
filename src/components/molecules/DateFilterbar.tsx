"use client";

import { DateRangePicker } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";
import { formatDate, subDays } from "date-fns";
import { PeriodValue } from "@/lib/chartUtils";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPeriod } from "@/lib/utils";
import { useGetFilter, useSetFilter } from "@/contexts/FilterContext";

type FilterbarProps = {
  maxDate?: Date;
  minDate?: Date;
  selectedDates: DateRange | undefined;
  onDatesChange: (dates: DateRange | undefined) => void;
};

export function Filterbar({
  maxDate,
  minDate,
  selectedDates,
  onDatesChange,
}: FilterbarProps) {
  return (
    <div className="sm:flex sm:items-center sm:gap-2">
      <DateRangePicker
        value={selectedDates}
        onChange={onDatesChange}
        className="w-full sm:w-fit"
        toDate={maxDate}
        fromDate={minDate}
        align="start"
        presets={[
          {
            label: "In past day",
            dateRange: {
              from: subDays(new Date(), 1),
              to: new Date(),
            },
          },
          {
            label: "Last 7 days",
            dateRange: {
              from: subDays(new Date(), 7),
              to: new Date(),
            },
          },
          {
            label: "Last 30 days",
            dateRange: {
              from: subDays(new Date(), 30),
              to: new Date(),
            },
          },
        ]}
      />
    </div>
  );
}

export function DateFilterWithPresets({
  onChange,
}: {
  onChange?: (dates: DateRange | undefined) => void;
}) {
  const { range: selectedDates, compareToPreviousPeriod } = useGetFilter();
  const { setRange: setSelectedDates, setCompareToPreviousPeriod } =
    useSetFilter();
  const [periodValue, setPeriodValue] = useState<PeriodValue>(() =>
    compareToPreviousPeriod ? "previous-period" : "no-comparison"
  );

  const prevDates = getPeriod(selectedDates);

  return (
    <>
      <Filterbar
        maxDate={new Date()}
        minDate={new Date(2022, 0, 1)}
        selectedDates={selectedDates}
        onDatesChange={(dates) => {
          setSelectedDates({
            from: dates?.from,
            to: dates?.to,
          });
          onChange?.(dates);
        }}
      />
      <p className="text-muted-foreground text-sm">Compared to</p>
      <Select
        defaultValue={periodValue}
        onValueChange={(period) => {
          setPeriodValue(period as PeriodValue);
          if (period === "previous-period") {
            setCompareToPreviousPeriod(true);
          } else {
            setCompareToPreviousPeriod(false);
          }
        }}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Select Period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            className="px-2"
            value="previous-period"
            title={`${
              prevDates?.from ? formatDate(prevDates?.from, "MMM dd, yyyy") : ""
            } - ${
              prevDates?.to ? formatDate(prevDates?.to, "MMM dd, yyyy") : ""
            }`}
          >
            Previous period
          </SelectItem>
          <SelectItem className="px-2" value="no-comparison">
            No comparison
          </SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
