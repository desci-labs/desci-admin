import {
  FilterState,
  getFilterContext,
  setFilterContext,
} from "./FilterContext";
import { PropsWithChildren, useState } from "react";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { DateRange } from "react-day-picker";

export default function FilterProvider(props: PropsWithChildren<unknown>) {
  const [state, setState] = useState<FilterState>({
    range: {
      from: startOfDay(subDays(new Date(), 30)),
      to: endOfDay(new Date()),
    },
    compareToPreviousPeriod: false,
  });

  const setRange = (range: DateRange) => {
    setState((prev) => ({ ...prev, range }));
  };

  const setCompareToPreviousPeriod = (compareToPreviousPeriod: boolean) => {
    setState((prev) => ({ ...prev, compareToPreviousPeriod }));
  };

  return (
    <getFilterContext.Provider value={state}>
      <setFilterContext.Provider
        value={{ setRange, setCompareToPreviousPeriod }}
      >
        {props.children}
      </setFilterContext.Provider>
    </getFilterContext.Provider>
  );
}
