import {
  DesciResearchAnalytics,
  SciweaveUserAnalytics,
} from "@/components/molecules/DesciResearchAnalytics";
import { startOfDay, subDays } from "date-fns";
import { tz } from "@date-fns/tz";
import { endOfDay } from "date-fns";
import { cookies } from "next/headers";

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
  return res.json() as Promise<UserSessionsDataItem[]>;
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

async function getEngagementStats(from: string, to: string) {
  const params = new URLSearchParams();
  params.set("from", from);
  params.set("to", to);

  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL
    }/api/sciweave-analytics/engagement-stats?${params.toString()}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );
  return res.json() as Promise<{
    totalChats: number;
    followupPercentage: number;
    avgChatsPerUser: number;
    activeUsers: number;
    errorRate: number;
    totalQuestions: number;
    emptyResponses: number;
  }>;
}

async function getNewUsersAnalytics(
  from: string,
  to: string,
  interval: string
) {
  const params = new URLSearchParams();
  params.set("from", from);
  params.set("to", to);
  params.set("interval", interval);
  console.log("getNewUsersAnalytics", {
    params: params.toString(),
    cookies: cookies().toString(),
  });
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/v1/admin/analytics/new-sciweave-users?${params.toString()}`,
    {
      credentials: "include",
      headers: {
        cookie: cookies().toString(),
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600,
      },
    }
  );
  const data = (await res.json()) as {
    data: SciweaveUserAnalytics;
  };
  return data.data;
}

export default async function DesciResearch({
  searchParams,
}: {
  searchParams: Promise<{ from: string; to: string; interval: string }>;
}) {
  const { from, to, interval } = await searchParams;
  const fromDate = from ? new Date(from) : subDays(new Date(), 29);
  const toDate = to ? new Date(to) : new Date();
  const groupBy = interval
    ? (interval as "daily" | "weekly" | "monthly")
    : "weekly";

  const normalizedFrom = startOfDay(fromDate, { in: tz("UTC") }).toISOString();
  const normalizedTo = endOfDay(toDate, { in: tz("UTC") }).toISOString();

  const [chats, uniqueUsers, userSessions, devices, engagementStats, newUsers] =
    await Promise.all([
      getChatsAnalytics(normalizedFrom, normalizedTo, groupBy),
      getUniqueUsersAnalytics(normalizedFrom, normalizedTo, groupBy),
      getUserSessionsAnalytics(normalizedFrom, normalizedTo, groupBy),
      getDevicesAnalytics(normalizedFrom, normalizedTo, groupBy),
      getEngagementStats(normalizedFrom, normalizedTo),
      getNewUsersAnalytics(normalizedFrom, normalizedTo, groupBy),
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
      engagementStats={engagementStats}
      newUsers={newUsers}
    />
  );
}
