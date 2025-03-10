/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getHeaders } from "@/lib/utils";
import { useState } from "react";
import Overview from "./Overview";
import AnalyticsCharts from "./AnalyticsCharts";

export default function Dashboard() {
  const [isDownloading, setIsDownloading] = useState(false);
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

  return (
    <>
      <div className="flex flex-col space-y-4 w-full">
        {/* <h1 className="text-2xl font-bold tracking-tight"></h1> */}
        <Button
          disabled={isDownloading}
          className="place-content-end self-end"
          onClick={downloadReport}
        >
          {isDownloading ? "downlading..." : "Download Report"}
        </Button>
        <Tabs
          orientation="vertical"
          defaultValue="analytics"
          className="space-y-4"
        >
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsCharts />
          </TabsContent>
          <TabsContent value="overview" className="space-y-4">
            <Overview />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

