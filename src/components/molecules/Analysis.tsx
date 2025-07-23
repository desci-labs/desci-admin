/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getHeaders } from "@/lib/utils";
import { useState } from "react";
import Overview from "./Overview";
import AnalyticsCharts from "./AnalyticsCharts";

export default function Dashboard() {
  const [tab, setTab] = useState<"analytics" | "overview">("overview");
  const [isDownloading, setIsDownloading] = useState(false);
  const [analyticsQuery, setAnalyticsQuery] = useState<{
    from: string;
    to: string;
    interval?: string;
  }>({ from: "", to: "", interval: "" });

  const downloadReport = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch("/api/download", {
        credentials: "include",
        headers: getHeaders(),
      });
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = "report.csv";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      URL.revokeObjectURL(fileURL);
    } catch (err) {
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAggregatedReport = async (query: {
    from: string;
    to: string;
    interval?: string;
  }) => {
    const queries = Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    console.log("queries", queries);
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/downloadAnalyticsReport?${queries}`, {
        credentials: "include",
        headers: getHeaders(),
      });
      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = "report.csv";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      URL.revokeObjectURL(fileURL);
    } catch (err) {
    } finally {
      setIsDownloading(false);
    }
  };

  const download = () => {
    tab === "analytics"
      ? downloadAggregatedReport(analyticsQuery)
      : downloadReport();
  };
  return (
    <>
      <div className="flex flex-col space-y-4 w-full">
        {/* <h1 className="text-2xl font-bold tracking-tight"></h1> */}

        <Tabs
          orientation="vertical"
          className="space-y-4"
          defaultValue={tab}
          onValueChange={(value) => setTab(value as typeof tab)}
        >
          <div className="w-full overflow-x-auto pb-2 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <Button
              disabled={isDownloading}
              className="place-content-end self-end"
              onClick={download}
            >
              {isDownloading ? "downlading..." : "Download Report"}
            </Button>
          </div>
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsCharts
              onQueryChange={(query) => {
                console.log("[analytics]", query);
                setAnalyticsQuery(query);
              }}
            />
          </TabsContent>
          <TabsContent value="overview" className="space-y-4">
            <Overview />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
