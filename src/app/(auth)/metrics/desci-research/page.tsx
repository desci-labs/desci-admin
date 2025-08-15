import { DesciResearchAnalytics } from "@/components/molecules/DesciResearchAnalytics";
import { startOfDay, subDays } from "date-fns";
import { tz, TZDate } from "@date-fns/tz";
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
    }/api/desci-research-analytics/chats?${params.toString()}`,
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
    }/api/desci-research-analytics/users?${params.toString()}`,
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
    }/api/desci-research-analytics/sessions?${params.toString()}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );
  return res.json() as Promise<UserSessionsDataItem[]>;
}

async function getDevicesAnalytics(from: string, to: string, interval: string) {
  const params = new URLSearchParams();
  params.set("from", from);
  params.set("to", to);
  params.set("interval", interval);

  console.log({ from, to });
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/desci-research-analytics/devices?${params.toString()}`,
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
  console.log({ baseurl: process.env.NEXT_PUBLIC_BASE_URL });
  const { from, to, interval } = await searchParams;
  const fromDate = from ? new Date(from) : subDays(new Date(), 29);
  const toDate = to ? new Date(to) : new Date();
  const groupBy = interval ? (interval as "day" | "week" | "month") : "week";

  // const normalizedFrom = startOfDay(
  //   new TZDate(
  //     fromDate.getFullYear(),
  //     fromDate.getMonth(),
  //     fromDate.getDate(),
  //     "UTC"
  //   )
  // )
  //   .withTimeZone("UTC")
  //   .toISOString();
  // const normalizedTo = endOfDay(
  //   new TZDate(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), "UTC")
  // )
  //   .withTimeZone("UTC")
  //   .toISOString();

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
