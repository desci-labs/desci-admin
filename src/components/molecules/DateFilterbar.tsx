"use client";

import { DateRangePicker } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";
import { formatDate, startOfDay } from "date-fns";
import { PeriodValue } from "@/lib/chartUtils";
import { endOfDay } from "date-fns";
import { useState } from "react";
import { DatePickerWithRange } from "../ui/DatePickerWithRange";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPeriod } from "@/lib/utils";

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
      />
    </div>
  );
}

export function DateFilterWithPresets({
  onChange,
}: {
  onChange?: (dates: DateRange | undefined) => void;
}) {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>({
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  });
  const [periodValue, setPeriodValue] = useState<PeriodValue>("no-comparison");

  const prevDates = getPeriod(selectedDates);

  return (
    <>
      <DatePickerWithRange
        selectedDates={selectedDates}
        onChange={(dates) => {
          setSelectedDates(dates);
          onChange?.(dates);
        }}
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
    </>
  );
}
