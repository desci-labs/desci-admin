import { DesciResearchAnalytics } from "@/components/molecules/DesciResearchAnalytics";
import { startOfDay, subDays } from "date-fns";
import { tz } from "@date-fns/tz";
import { endOfDay } from "date-fns";

interface DataItem {
  date: string;
  value: string;
}

interface DevicesDataItem {
  date: Date;
  mobile: number;
  tablet: number;
  mac: number;
  windows: number;
  otherDesktops: number;
  unknown: number;
}

interface UserSessionsDataItem {
  date: Date;
  sessionCount: number;
  durationInSeconds: number;
}

async function getChatsAnalytics(from: string, to: string, interval: string) {
  const params = new URLSearchParams();

  params.set("from", from);
  params.set("to", to);
  params.set("interval", interval);

  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/sciweave-analytics/chats?${params.toString()}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );
  return res.json() as Promise<DataItem[]>;
}
async function getUniqueUsersAnalytics(
  from: string,
  to: string,
  interval: string
) {
  const params = new URLSearchParams();
  params.set("from", from);
  params.set("to", to);
  params.set("interval", interval);

  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/sciweave-analytics/users?${params.toString()}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );
  return res.json() as Promise<DataItem[]>;
}

async function getUserSessionsAnalytics(
  from: string,
  to: string,
  interval: string
) {
  const params = new URLSearchParams();
  params.set("from", from);
  params.set("to", to);
  params.set("interval", interval);

  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/sciweave-analytics/sessions?${params.toString()}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );
  
  if (!res.ok) {
    console.error('Failed to fetch user sessions:', res.status, res.statusText);
    return [];
  }
  
  const data = await res.json();
  if (!Array.isArray(data)) {
    console.error('Expected array from user sessions API, got:', data);
    return [];
  }
  
  return data as UserSessionsDataItem[];
}

async function getDevicesAnalytics(from: string, to: string, interval: string) {
  const params = new URLSearchParams();
  params.set("from", from);
  params.set("to", to);
  params.set("interval", interval);

  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/sciweave-analytics/devices?${params.toString()}`,
    {
      next: {
        revalidate: 0,
      },
    }
  );
  return res.json() as Promise<DevicesDataItem[]>;
}

export default async function DesciResearch({
  searchParams,
}: {
  searchParams: Promise<{ from: string; to: string; interval: string }>;
}) {
  const { from, to, interval } = await searchParams;
  const fromDate = from ? new Date(from) : subDays(new Date(), 29);
  const toDate = to ? new Date(to) : new Date();
  const groupBy = interval ? (interval as "day" | "week" | "month") : "week";

  const normalizedFrom = startOfDay(fromDate, { in: tz("UTC") }).toISOString();
  const normalizedTo = endOfDay(toDate, { in: tz("UTC") }).toISOString();

  const [chats, uniqueUsers, userSessions, devices] = await Promise.all([
    getChatsAnalytics(normalizedFrom, normalizedTo, groupBy),
    getUniqueUsersAnalytics(normalizedFrom, normalizedTo, groupBy),
    getUserSessionsAnalytics(normalizedFrom, normalizedTo, groupBy),
    getDevicesAnalytics(normalizedFrom, normalizedTo, groupBy),
  ]);

  return (
    <DesciResearchAnalytics
      chats={chats}
      uniqueUsers={uniqueUsers}
      userSessions={userSessions}
      devices={devices}
      selectedDates={{
        from: fromDate,
        to: toDate,
      }}
      interval={groupBy}
    />
  );
}
