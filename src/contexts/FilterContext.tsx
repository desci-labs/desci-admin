import { endOfDay, startOfDay, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { createContext, useContext } from "react";

export type FilterState = {
  range: DateRange;
  compareToPreviousPeriod: boolean;
};

type Setters = {
  setRange: (range: DateRange) => void;
  setCompareToPreviousPeriod: (compareToPreviousPeriod: boolean) => void;
};

export const getFilterContext = createContext<FilterState>({
  range: {
    from: startOfDay(subDays(new Date(), 30)),
    to: endOfDay(new Date()),
  },
  compareToPreviousPeriod: false,
});

export const setFilterContext = createContext<Setters>({
  setRange: () => ({}),
  setCompareToPreviousPeriod: () => ({}),
});

export const useGetFilter = () => useContext(getFilterContext);
export const useSetFilter = () => useContext(setFilterContext);
