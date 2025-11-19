"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/organisms/ip-usage-datatable/data-table";
import { columns } from "@/components/organisms/ip-usage-datatable/columns";
import { IpUsage } from "@/components/organisms/ip-usage-datatable/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function IpUsagePage() {
  const [data, setData] = useState<IpUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (dateRange.from) {
        params.set("from", dateRange.from.toISOString());
      }
      if (dateRange.to) {
        params.set("to", dateRange.to.toISOString());
      }

      const queryString = params.toString();
      const url = `/api/sciweave-analytics/ip-usage${queryString ? `?${queryString}` : ""}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch IP usage data");
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyFilter = () => {
    fetchData();
  };

  const handleResetFilter = () => {
    setDateRange({ from: undefined, to: undefined });
    setTimeout(() => {
      fetchData();
    }, 0);
  };

  const totalHits = data.reduce((sum, item) => sum + item.total_hits, 0);
  const totalAnonHits = data.reduce((sum, item) => sum + item.anon_hits, 0);
  const overallAnonPct = totalHits > 0 ? (totalAnonHits / totalHits) * 100 : 0;

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SciWeave IP Usage Monitor</h2>
          <p className="text-muted-foreground">
            Track guest and authenticated usage by IP address to detect potential abuse
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total IPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">Unique IP addresses tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All search queries tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guest Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAnonPct.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {totalAnonHits.toLocaleString()} guest hits
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Date Filter</CardTitle>
          <CardDescription>
            Filter usage data by date range. Leave empty to show all-time data.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">From Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? format(dateRange.from, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">To Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? format(dateRange.to, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApplyFilter} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Apply Filter"
              )}
            </Button>
            {(dateRange.from || dateRange.to) && (
              <Button variant="outline" onClick={handleResetFilter} disabled={loading}>
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>IP Usage Details</CardTitle>
              <CardDescription>
                Detailed breakdown of usage per IP address. 
                <Badge variant="destructive" className="ml-2">High</Badge> indicates potential abuse patterns.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && data.length === 0 ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-destructive">{error}</p>
            </div>
          ) : (
            <DataTable columns={columns} data={data} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

