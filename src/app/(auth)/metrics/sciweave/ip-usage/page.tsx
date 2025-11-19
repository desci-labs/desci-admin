"use client";

import { useState } from "react";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/organisms/ip-usage-datatable/data-table";
import { columns } from "@/components/organisms/ip-usage-datatable/columns";
import { IpUsage } from "@/components/organisms/ip-usage-datatable/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format, subMonths, subYears } from "date-fns";
import { CalendarIcon, Loader2, ShieldAlert, Users, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type UserType = "guests" | "users" | "all";
type DatePreset = "1m" | "3m" | "6m" | "1y" | "all" | "custom";

const fetchIpUsage = async (from?: Date, to?: Date): Promise<IpUsage[]> => {
  const params = new URLSearchParams();
  if (from) {
    params.set("from", from.toISOString());
  }
  if (to) {
    params.set("to", to.toISOString());
  }

  const queryString = params.toString();
  const url = `/api/sciweave-analytics/ip-usage${queryString ? `?${queryString}` : ""}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error("Failed to fetch usage data");
  }
  
  return response.json();
};

export default function IpUsagePage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });
  const [userType, setUserType] = useState<UserType>("guests");
  const [datePreset, setDatePreset] = useState<DatePreset | null>("1m");
  const [loadingTime, setLoadingTime] = useState(0);
  const loadingTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const { data = [], isLoading, error, isFetching } = useQuery({
    queryKey: ["ip-usage", dateRange.from?.toISOString(), dateRange.to?.toISOString()],
    queryFn: () => fetchIpUsage(dateRange.from, dateRange.to),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Track loading time
  React.useEffect(() => {
    if (isFetching) {
      setLoadingTime(0);
      loadingTimerRef.current = setInterval(() => {
        setLoadingTime((prev) => prev + 0.1);
      }, 100);
    } else {
      if (loadingTimerRef.current) {
        clearInterval(loadingTimerRef.current);
        loadingTimerRef.current = null;
      }
    }

    return () => {
      if (loadingTimerRef.current) {
        clearInterval(loadingTimerRef.current);
      }
    };
  }, [isFetching]);

  const handleDatePreset = (preset: DatePreset) => {
    const today = new Date();
    setDatePreset(preset);
    
    let newRange = { from: undefined as Date | undefined, to: undefined as Date | undefined };
    
    switch (preset) {
      case "1m":
        newRange = { from: subMonths(today, 1), to: today };
        break;
      case "3m":
        newRange = { from: subMonths(today, 3), to: today };
        break;
      case "6m":
        newRange = { from: subMonths(today, 6), to: today };
        break;
      case "1y":
        newRange = { from: subYears(today, 1), to: today };
        break;
      case "all":
        newRange = { from: undefined, to: undefined };
        break;
      case "custom":
        // Keep existing date range
        return;
    }
    
    setDateRange(newRange);
    // fetchData will be called automatically via useEffect
  };

  const handleApplyCustomDates = () => {
    setDatePreset("custom");
  };

  const handleResetFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    setDatePreset(null);
    setUserType("guests");
  };

  // Filter data based on user type
  const filteredData = data.filter((item) => {
    if (userType === "guests") return item.anon_hits > 0;
    if (userType === "users") return item.auth_hits > 0;
    return true; // all
  });

  const totalHits = filteredData.reduce((sum, item) => sum + item.total_hits, 0);
  const totalAnonHits = filteredData.reduce((sum, item) => sum + item.anon_hits, 0);
  const totalAuthHits = filteredData.reduce((sum, item) => sum + item.auth_hits, 0);
  const overallAnonPct = totalHits > 0 ? (totalAnonHits / totalHits) * 100 : 0;

  const hasFilters = dateRange.from || dateRange.to || userType !== "guests";

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SciWeave Usage Monitoring</h2>
          <p className="text-muted-foreground mt-1">
            Monitor usage patterns and detect potential abuse by IP address
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">IP addresses tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Search queries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guest Queries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnonHits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallAnonPct.toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Queries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAuthHits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalHits > 0 ? ((totalAuthHits / totalHits) * 100).toFixed(1) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle>Usage by IP Address</CardTitle>
              <CardDescription className="mt-1">
                Track usage patterns per IP address. IPs with high guest usage (
                <Badge variant="destructive" className="mx-1 py-0 h-5">High</Badge>
                ) may indicate potential abuse.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Tabs value={userType} onValueChange={(v: string) => setUserType(v as UserType)}>
                <TabsList>
                  <TabsTrigger value="guests">Guests</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-1 rounded-lg border p-1">
                <Button
                  variant={datePreset === "1m" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleDatePreset("1m")}
                >
                  1M
                </Button>
                <Button
                  variant={datePreset === "3m" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleDatePreset("3m")}
                >
                  3M
                </Button>
                <Button
                  variant={datePreset === "6m" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleDatePreset("6m")}
                >
                  6M
                </Button>
                <Button
                  variant={datePreset === "1y" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleDatePreset("1y")}
                >
                  1Y
                </Button>
                <Button
                  variant={datePreset === "all" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => handleDatePreset("all")}
                >
                  All Time
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={datePreset === "custom" ? "secondary" : "ghost"}
                      size="sm"
                      className="h-8 px-3"
                    >
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      Custom
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <div className="p-3 space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">From Date</label>
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">To Date</label>
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleApplyCustomDates} size="sm" className="flex-1">
                          Apply
                        </Button>
                        <Button 
                          onClick={() => {
                            setDateRange({ from: undefined, to: undefined });
                            setDatePreset(null);
                          }} 
                          variant="outline" 
                          size="sm"
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-destructive">{error instanceof Error ? error.message : "An error occurred"}</p>
            </div>
          ) : (
            <div className="relative min-h-[400px]">
              <DataTable columns={columns} data={filteredData} />
              
              {isFetching && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-lg font-medium">Loading data...</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {loadingTime.toFixed(1)}s elapsed
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

