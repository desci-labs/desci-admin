"use client";

import * as React from "react";
import { addDays, format, setDate, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn, getPeriod } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DatePickerWithRangeProps = {
  // maxDate?: Date
  // minDate?: Date
  selectedDates: DateRange | undefined;
  onChange: (dates: DateRange | undefined) => void;
  className?: string;
};

export function DatePickerWithRange({
  className,
  selectedDates,
  onChange,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-auto px-3 gap-2 justify-start text-left font-normal",
              !selectedDates && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {selectedDates?.from ? (
              selectedDates.to ? (
                <>
                  {format(selectedDates.from, "LLL dd, y")} -{" "}
                  {format(selectedDates.to, "LLL dd, y")}
                </>
              ) : (
                format(selectedDates.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 flex flex-col gap-2"
          align="start"
        >
          <Select
            onValueChange={(value) =>
              onChange({
                to: new Date(),
                from: subDays(new Date(), parseInt(value)),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="1">In past day</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedDates?.from}
            toDate={new Date()}
            selected={selectedDates}
            onSelect={(date) => {
              onChange(date);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
