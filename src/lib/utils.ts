import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AUTH_COOKIE_FIELDNAME } from "./constants";

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
