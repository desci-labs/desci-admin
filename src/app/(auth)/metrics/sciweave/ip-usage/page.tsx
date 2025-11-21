"use client";

import { useState } from "react";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { DataTable } from "@/components/organisms/ip-usage-datatable/data-table";
import { createColumns } from "@/components/organisms/ip-usage-datatable/columns";
import { IpUsage } from "@/components/organisms/ip-usage-datatable/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, subMonths, subYears, subDays, subWeeks } from "date-fns";
import { CalendarIcon, Loader2, ShieldAlert, Users, Globe, ShieldCheck, Trash2, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getInstitutionInfo } from "@/lib/ip-utils";

type UserType = "guests" | "users" | "all";
type DatePreset = "1d" | "1w" | "1m" | "3m" | "6m" | "1y" | "all" | "custom";

// Default whitelist with local IPs
const DEFAULT_WHITELIST: Record<string, string> = {
  "127.0.0.1": "Local IPv4",
  "::1": "Local IPv6",
};

const WHITELIST_STORAGE_KEY = "sciweave-ip-whitelist";
const WHITELIST_ENABLED_KEY = "sciweave-whitelist-enabled";
const COLUMN_VISIBILITY_KEY = "sciweave-column-visibility";
const SHOW_INSTITUTIONS_KEY = "sciweave-show-institutions";

const DEFAULT_COLUMN_VISIBILITY = {
  ip_address: true,
  total_hits: true,
  anon_hits: true,
  user_hits: true,
  anon_pct: true,
  first_seen: true,
  last_seen: true,
  actions: true,
};

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
    from: subDays(new Date(), 1),
    to: new Date(),
  });
  const [userType, setUserType] = useState<UserType>("guests");
  const [datePreset, setDatePreset] = useState<DatePreset | null>("1d");
  const [loadingTime, setLoadingTime] = useState(0);
  const loadingTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Whitelist state
  const [whitelist, setWhitelist] = useState<Record<string, string>>({});
  const [whitelistEnabled, setWhitelistEnabled] = useState(true); // Default to true
  const [whitelistDialogOpen, setWhitelistDialogOpen] = useState(false);
  const [newIp, setNewIp] = useState("");
  const [newNote, setNewNote] = useState("");
  const noteInputRef = React.useRef<HTMLInputElement>(null);
  
  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(DEFAULT_COLUMN_VISIBILITY);
  const [showInstitutions, setShowInstitutions] = useState(false); // Default to false (hide institutions)

  // Initialize whitelist from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem(WHITELIST_STORAGE_KEY);
    const enabledStored = localStorage.getItem(WHITELIST_ENABLED_KEY);
    const columnVisStored = localStorage.getItem(COLUMN_VISIBILITY_KEY);
    const showInstitutionsStored = localStorage.getItem(SHOW_INSTITUTIONS_KEY);
    
    if (stored) {
      setWhitelist(JSON.parse(stored));
    } else {
      // First time, use defaults
      setWhitelist(DEFAULT_WHITELIST);
      localStorage.setItem(WHITELIST_STORAGE_KEY, JSON.stringify(DEFAULT_WHITELIST));
    }
    
    if (enabledStored) {
      setWhitelistEnabled(enabledStored === "true");
    } else {
      // Default to true on first load
      setWhitelistEnabled(true);
      localStorage.setItem(WHITELIST_ENABLED_KEY, "true");
    }
    
    if (columnVisStored) {
      setColumnVisibility(JSON.parse(columnVisStored));
    }
    
    if (showInstitutionsStored) {
      setShowInstitutions(showInstitutionsStored === "true");
    }
  }, []);

  // Save whitelist to localStorage whenever it changes
  React.useEffect(() => {
    if (Object.keys(whitelist).length > 0) {
      localStorage.setItem(WHITELIST_STORAGE_KEY, JSON.stringify(whitelist));
    }
  }, [whitelist]);

  // Save enabled state to localStorage
  React.useEffect(() => {
    localStorage.setItem(WHITELIST_ENABLED_KEY, String(whitelistEnabled));
  }, [whitelistEnabled]);
  
  // Save column visibility to localStorage
  React.useEffect(() => {
    localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  // Save show institutions state to localStorage
  React.useEffect(() => {
    localStorage.setItem(SHOW_INSTITUTIONS_KEY, String(showInstitutions));
  }, [showInstitutions]);

  const handleAddToWhitelist = () => {
    if (newIp.trim()) {
      setWhitelist((prev) => ({ ...prev, [newIp.trim()]: newNote.trim() }));
      setNewIp("");
      setNewNote("");
    }
  };

  const handleRemoveFromWhitelist = (ip: string) => {
    setWhitelist((prev) => {
      const updated = { ...prev };
      delete updated[ip];
      return updated;
    });
  };

  const handleResetWhitelist = () => {
    setWhitelist(DEFAULT_WHITELIST);
    localStorage.setItem(WHITELIST_STORAGE_KEY, JSON.stringify(DEFAULT_WHITELIST));
  };

  const handleWhitelistFromTable = (ip: string) => {
    setNewIp(ip);
    setWhitelistDialogOpen(true);
  };

  // Focus note field when dialog opens with prefilled IP
  React.useEffect(() => {
    if (whitelistDialogOpen && newIp && noteInputRef.current) {
      // Small delay to ensure dialog is fully rendered
      setTimeout(() => {
        noteInputRef.current?.focus();
      }, 100);
    }
  }, [whitelistDialogOpen, newIp]);

  const { data = [], isLoading, error, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ["ip-usage", dateRange.from?.toISOString(), dateRange.to?.toISOString()],
    queryFn: () => fetchIpUsage(dateRange.from, dateRange.to),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading
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
      case "1d":
        newRange = { from: subDays(today, 1), to: today };
        break;
      case "1w":
        newRange = { from: subWeeks(today, 1), to: today };
        break;
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

  // Filter data based on user type, whitelist, and institutions
  const filteredData = data.filter((item) => {
    // Apply whitelist filter if enabled - hide whitelisted (known/trusted) IPs
    if (whitelistEnabled && whitelist[item.ip_address]) {
      return false;
    }
    
    // Apply institution filter - hide institutions if showInstitutions is false (default)
    if (!showInstitutions && getInstitutionInfo(item.ip_address)) {
      return false;
    }
    
    // Apply user type filter
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
  
  // Create columns with whitelist handler
  const columns = React.useMemo(
    () => createColumns(handleWhitelistFromTable),
    []
  );

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex mx-1">
                      <Badge variant="destructive" className="py-0 h-5">High</Badge>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>≥ 10 guest queries or ≥ 80% with ≥ 10 total queries</p>
                  </TooltipContent>
                </Tooltip>
                ) may indicate potential abuse.
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2 lg:flex-row-reverse lg:items-center">
              {/* Settings Button */}
              <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center justify-center px-3 h-[43px] rounded-lg border p-1 bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                    <Settings className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Column Visibility</h4>
                      <div className="space-y-2">
                        {[
                          { key: "ip_address", label: "IP Address" },
                          { key: "total_hits", label: "Total Hits" },
                          { key: "anon_hits", label: "Guest Hits" },
                          { key: "user_hits", label: "User Hits" },
                          { key: "anon_pct", label: "Guest %" },
                          { key: "first_seen", label: "First Seen" },
                          { key: "last_seen", label: "Last Seen" },
                          { key: "actions", label: "Actions" },
                        ].map((column) => (
                          <div key={column.key} className="flex items-center gap-2">
                            <Checkbox
                              id={`col-${column.key}`}
                              checked={columnVisibility[column.key] !== false}
                              onCheckedChange={(checked) => {
                                setColumnVisibility((prev) => ({
                                  ...prev,
                                  [column.key]: checked as boolean,
                                }));
                              }}
                            />
                            <Label
                              htmlFor={`col-${column.key}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {column.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium text-sm mb-3">Filters</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="whitelist-enabled-settings"
                            checked={whitelistEnabled}
                            onCheckedChange={(checked) => setWhitelistEnabled(checked as boolean)}
                          />
                          <Label htmlFor="whitelist-enabled-settings" className="text-sm font-normal cursor-pointer">
                            Hide Known IPs
                          </Label>
                          {whitelistEnabled && (
                            <Badge variant="secondary" className="ml-auto">
                              {Object.keys(whitelist).length}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="show-institutions-settings"
                            checked={showInstitutions}
                            onCheckedChange={(checked) => setShowInstitutions(checked as boolean)}
                          />
                          <Label htmlFor="show-institutions-settings" className="text-sm font-normal cursor-pointer">
                            Show Institutions
                          </Label>
                        </div>
                        
                        <Dialog open={whitelistDialogOpen} onOpenChange={setWhitelistDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full gap-2">
                              <ShieldCheck className="h-4 w-4" />
                              Manage Whitelist
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>IP Whitelist Management</DialogTitle>
                  <DialogDescription>
                    Mark known/trusted IP addresses (e.g., internal team, dev IPs) to hide them from the monitoring view.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 flex-1 overflow-y-auto">
                  {/* Add IP Section */}
                  <div className="space-y-2 p-3 rounded-lg border bg-muted/50">
                    <h3 className="font-medium text-sm">Add Known IP to Whitelist</h3>
                    <div className="flex items-end gap-2">
                      <div className="space-y-1.5 w-[180px]">
                        <Label htmlFor="new-ip" className="text-xs">IP Address</Label>
                        <Input
                          id="new-ip"
                          placeholder="192.168.1.1"
                          value={newIp}
                          onChange={(e) => setNewIp(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddToWhitelist();
                            }
                          }}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <Label htmlFor="new-note" className="text-xs">Note (optional)</Label>
                        <Input
                          ref={noteInputRef}
                          id="new-note"
                          placeholder="Internal team, Dev environment"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddToWhitelist();
                            }
                          }}
                          className="h-9"
                        />
                      </div>
                      <Button onClick={handleAddToWhitelist} disabled={!newIp.trim()} size="sm" className="h-9">
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Whitelist Table */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">Whitelisted IPs ({Object.keys(whitelist).length})</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetWhitelist}
                        className="text-muted-foreground hover:text-foreground h-8"
                      >
                        Reset to Default
                      </Button>
                    </div>
                    
                    {Object.keys(whitelist).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No IPs whitelisted
                      </div>
                    ) : (
                      <div className="rounded-md border">
                        <table className="w-full">
                          <thead className="border-b bg-muted/50">
                            <tr>
                              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">IP Address</th>
                              <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Note</th>
                              <th className="w-[60px] py-2 px-3"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(whitelist).map(([ip, note]) => (
                              <tr key={ip} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                <td className="py-2 px-3 font-mono text-sm">{ip}</td>
                                <td className="py-2 px-3 text-sm text-muted-foreground">
                                  {note || <span className="italic text-xs">—</span>}
                                </td>
                                <td className="py-2 px-3 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFromWhitelist(ip)}
                                    className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <LayoutGroup id="date-preset">
                <div className="flex items-center gap-1 rounded-lg border p-1 bg-muted/50">
                  {(["1d", "1w", "1m", "3m", "6m", "1y", "all"] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleDatePreset(preset)}
                      className={cn(
                        "relative px-3 h-8 text-sm font-medium transition-colors rounded-md whitespace-nowrap",
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
                          "relative px-3 h-8 text-sm font-medium transition-colors rounded-md flex items-center gap-1 whitespace-nowrap",
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
              
              <LayoutGroup id="user-type">
                <div className="flex items-center gap-1 rounded-lg border p-1 bg-muted/50">
                  {(["guests", "users", "all"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setUserType(type)}
                      className={cn(
                        "relative px-3 h-8 text-sm font-medium transition-colors rounded-md whitespace-nowrap",
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
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-destructive">{error instanceof Error ? error.message : "An error occurred"}</p>
            </div>
          ) : (
            <div className="relative">
              <div className={cn("transition-all duration-300", isFetching && "blur-sm opacity-60")}>
                <DataTable 
                  columns={columns} 
                  data={filteredData}
                  columnVisibility={columnVisibility}
                  onColumnVisibilityChange={setColumnVisibility}
                />
              </div>
              
              <AnimatePresence>
                {isFetching && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none"
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