"use client";

import { useState } from "react";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { DataTable } from "@/components/organisms/ip-usage-datatable/data-table";
import { columns } from "@/components/organisms/ip-usage-datatable/columns";
import { IpUsage } from "@/components/organisms/ip-usage-datatable/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

  const { data = [], isLoading, error, isFetching, dataUpdatedAt } = useQuery({
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
    if (userType === "users") return item.user_hits > 0;
    return true; // all
  });

  const totalHits = filteredData.reduce((sum, item) => sum + item.total_hits, 0);
  const totalAnonHits = filteredData.reduce((sum, item) => sum + item.anon_hits, 0);
  const totalUserHits = filteredData.reduce((sum, item) => sum + item.user_hits, 0);
  const overallAnonPct = totalHits > 0 ? (totalAnonHits / totalHits) * 100 : 0;
  const overallUserPct = totalHits > 0 ? (totalUserHits / totalHits) * 100 : 0;

  const hasFilters = dateRange.from || dateRange.to || userType !== "guests";

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-2"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SciWeave Usage Monitoring</h2>
          <p className="text-muted-foreground mt-1">
            Monitor usage patterns and detect potential abuse by IP address
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="grid gap-4 md:grid-cols-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={isFetching ? "loading" : `${dataUpdatedAt}-${filteredData.length}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-2xl font-bold"
            >
              {isFetching ? "-" : filteredData.length}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="text-xs text-muted-foreground mt-1"
            >
              IP addresses tracked
            </motion.p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={isFetching ? "loading" : `${dataUpdatedAt}-${totalHits}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-2xl font-bold"
            >
              {isFetching ? "-" : totalHits.toLocaleString()}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="text-xs text-muted-foreground mt-1"
            >
              Search queries
            </motion.p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guest Queries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={isFetching ? "loading" : `${dataUpdatedAt}-${totalAnonHits}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-2xl font-bold"
            >
              {isFetching ? "-" : totalAnonHits.toLocaleString()}
            </motion.div>
            <motion.p
              key={isFetching ? "loading-pct" : `${dataUpdatedAt}-${overallAnonPct}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="text-xs text-muted-foreground mt-1"
            >
              {isFetching ? "-" : `${overallAnonPct.toFixed(1)}% of total`}
            </motion.p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Queries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              key={isFetching ? "loading" : `${dataUpdatedAt}-${totalUserHits}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-2xl font-bold"
            >
              {isFetching ? "-" : totalUserHits.toLocaleString()}
            </motion.div>
            <motion.p
              key={isFetching ? "loading-pct" : `${dataUpdatedAt}-${overallUserPct}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="text-xs text-muted-foreground mt-1"
            >
              {isFetching ? "-" : `${overallUserPct.toFixed(1)}% of total`}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
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
              <LayoutGroup id="user-type">
                <div className="flex items-center gap-1 rounded-lg border p-1 bg-muted/50">
                  {(["guests", "users", "all"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setUserType(type)}
                      className={cn(
                        "relative px-3 h-8 text-sm font-medium transition-colors rounded-md",
                        userType === type
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {userType === type && (
                        <motion.div
                          layoutId="user-type-indicator"
                          className="absolute inset-0 bg-background rounded-md shadow-sm"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
              
              <LayoutGroup id="date-preset">
                <div className="flex items-center gap-1 rounded-lg border p-1 bg-muted/50">
                  {(["1m", "3m", "6m", "1y", "all"] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleDatePreset(preset)}
                      className={cn(
                        "relative px-3 h-8 text-sm font-medium transition-colors rounded-md",
                        datePreset === preset
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {datePreset === preset && (
                        <motion.div
                          layoutId="date-preset-indicator"
                          className="absolute inset-0 bg-background rounded-md shadow-sm"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">
                        {preset === "all" ? "All Time" : preset.toUpperCase()}
                      </span>
                    </button>
                  ))}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className={cn(
                          "relative px-3 h-8 text-sm font-medium transition-colors rounded-md flex items-center gap-1",
                          datePreset === "custom"
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {datePreset === "custom" && (
                          <motion.div
                            layoutId="date-preset-indicator"
                            className="absolute inset-0 bg-background rounded-md shadow-sm"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <CalendarIcon className="relative z-10 h-3 w-3" />
                        <span className="relative z-10">Custom</span>
                      </button>
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
              </LayoutGroup>
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
              
              <AnimatePresence>
                {isFetching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    </motion.div>
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="text-lg font-medium"
                    >
                      Loading data...
                    </motion.p>
                    <motion.p
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="text-sm text-muted-foreground mt-2"
                    >
                      {loadingTime.toFixed(1)}s elapsed
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

