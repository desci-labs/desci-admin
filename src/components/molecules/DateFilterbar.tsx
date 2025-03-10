"use client"

import { DateRangePicker } from "@/components/ui/date-picker"
import { DateRange } from "react-day-picker"

type FilterbarProps = {
  maxDate?: Date
  minDate?: Date
  selectedDates: DateRange | undefined
  onDatesChange: (dates: DateRange | undefined) => void
}

export function Filterbar({
  maxDate,
  minDate,
  selectedDates,
  onDatesChange,
}: FilterbarProps) {
  return (
    <div className="w-full sm:flex sm:items-center sm:gap-2">
      <DateRangePicker
        value={selectedDates}
        onChange={onDatesChange}
        className="w-full sm:w-fit"
        toDate={maxDate}
        fromDate={minDate}
        align="start"
      />
    </div>
  )
}