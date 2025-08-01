import { clsx, type ClassValue } from "clsx";
import { differenceInDays, subDays, subYears } from "date-fns";
import { twMerge } from "tailwind-merge";
import { DateRange } from "react-day-picker";
import { AUTH_COOKIE_FIELDNAME } from "./constants";
import prettyBytes from "pretty-bytes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getHeaders = () => {
  if (!window) return undefined;

  if (window?.localStorage)
    return {
      Authorization: `Bearar ${
        localStorage.getItem(AUTH_COOKIE_FIELDNAME) ?? ""
      }`,
      // Cookie: `${AUTH_COOKIE_FIELDNAME}=${localStorage.getItem(AUTH_COOKIE_FIELDNAME)}`
    };
  return undefined;
};

// Tremor Raw focusInput [v0.0.1]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-indigo-200 focus:dark:ring-indigo-700/30",
  // border color
  "focus:border-indigo-500 focus:dark:border-indigo-700",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-indigo-500 dark:outline-indigo-500",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
];

// Number formatter function

export const usNumberformatter = (number: number, decimals = 0) =>
  Intl.NumberFormat("en-Us", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString();

export const percentageFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  const symbol = number > 0 && number !== Infinity ? "+" : "";

  return `${symbol}${formattedNumber}`;
};

export const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
});

export const millionFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  return `${formattedNumber}M`;
};

const byteValueNumberFormatter = Intl.NumberFormat("en", {
  notation: "compact",
  style: "unit",
  unit: "byte",
  unitDisplay: "narrow",
});

export const formatters: { [key: string]: any } = {
  currency: (number: number, currency: string = "USD") =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(number),
  byte: (number: number) =>
    prettyBytes(number, { signed: true, maximumFractionDigits: 2 }),
  unit: (number: number) => `${usNumberformatter(number)}`,
  percent: (number: number, decimals = 1) =>
    percentageFormatter(number, decimals),
};

export const getPeriod = (
  dateRange: DateRange | undefined
): DateRange | undefined => {
  if (!dateRange || !dateRange.from || !dateRange.to) return undefined;
  const from = dateRange.from;
  const to = dateRange.to;
  let lastPeriodFrom;
  let lastPeriodTo;
  let diffInDays = differenceInDays(to!, from!);
  if (from) {
    lastPeriodFrom = subDays(from, diffInDays + 1);
  }
  if (to) {
    lastPeriodTo = subDays(to, diffInDays + 1);
  }
  return { from: lastPeriodFrom, to: lastPeriodTo };
};

export const getBadgeType = (value: number) => {
  if (value > 0) {
    return "success";
  } else if (value < 0) {
    if (value < -50) {
      return "warning";
    }
    return "error";
  } else {
    return "neutral";
  }
};

export const getTrend = (current: number, previous: number) =>
  Math.round((current - previous) / (previous || 1));
