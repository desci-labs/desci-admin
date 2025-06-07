"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBadgeType, percentageFormatter } from "@/lib/utils";
import { MetricCardProps } from "@/types/metrics";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/custom/Badge";

export function MetricCard({
  title,
  value,
  description,
  trend,
  isLoading,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className="transition-all duration-200 hover:border-blue-500/50 hover:shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-[100px]" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px]" />
          {description && <Skeleton className="mt-2 h-4 w-[200px]" />}
        </CardContent>
      </Card>
    );
  }

  const badgeType = value >= 0 ? "success" : "destructive";

  return (
    <Card className="transition-all duration-200 hover:border-blue-500/50 hover:shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend !== undefined && (
          <div
            className={`flex items-center ${
              trend >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
            {/* <span className="ml-1 text-xs">{Math.abs(trend)}%</span> */}
            <Badge variant={getBadgeType(value)}>
              {percentageFormatter(Number.isNaN(value) ? 0 : value)}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}%</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
