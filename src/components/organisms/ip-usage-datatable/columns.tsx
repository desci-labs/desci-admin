"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { IpUsage } from "./schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { EyeOff, GraduationCap } from "lucide-react";
import { getInstitutionInfo, getCountryFlag } from "@/lib/ip-utils";

export const createColumns = (onWhitelist: (ip: string) => void): ColumnDef<IpUsage>[] => [
  {
    accessorKey: "ip_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP Address" />
    ),
    cell: ({ row }) => {
      const ip = row.getValue("ip_address") as string;
      const institutionInfo = getInstitutionInfo(ip);
      
      return (
        <div className="flex items-center gap-2">
          <div className="font-mono text-sm">{ip}</div>
          {institutionInfo && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="gap-1 text-xs">
                    <GraduationCap className="h-3 w-3" />
                    <span>{getCountryFlag(institutionInfo.country)}</span>
                  </Badge>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-semibold">{institutionInfo.name}</p>
                  <p className="text-muted-foreground">{institutionInfo.region}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "total_hits",
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Total Hits" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center font-semibold">
        {row.getValue("total_hits")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "anon_hits",
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Guest Hits" />
      </div>
    ),
    cell: ({ row }) => {
      const anonHits = row.getValue("anon_hits") as number;
      const isHighUsage = anonHits >= 10;
      return (
        <div className="text-center">
          {isHighUsage ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Badge
                    variant="destructive"
                    className="font-semibold"
                  >
                    {anonHits}
                  </Badge>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>High usage: ≥ 10 guest queries</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Badge
              variant="secondary"
              className="font-semibold"
            >
              {anonHits}
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "user_hits",
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="User Hits" />
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.getValue("user_hits")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "anon_pct",
    header: ({ column }) => (
      <div className="text-center">
        <DataTableColumnHeader column={column} title="Guest %" />
      </div>
    ),
    cell: ({ row }) => {
      const pct = row.getValue("anon_pct") as number;
      const totalHits = row.getValue("total_hits") as number;
      const isHighPct = pct >= 80 && totalHits >= 10;
      return (
        <div className="text-center">
          {isHighPct ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Badge variant="destructive">
                    {pct.toFixed(1)}%
                  </Badge>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>High guest usage: ≥ 80% with ≥ 10 total queries</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Badge variant="outline">
              {pct.toFixed(1)}%
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "first_seen",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Seen" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("first_seen"));
      return (
        <div className="text-sm text-muted-foreground">
          {format(date, "MMM d, yyyy")}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "last_seen",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Seen" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("last_seen"));
      return (
        <div className="text-sm text-muted-foreground">
          {format(date, "MMM d, yyyy")}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const ip = row.getValue("ip_address") as string;
      return (
        <div className="text-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWhitelist(ip)}
                className="h-8 w-8 p-0"
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hide IP (add to whitelist)</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
    enableSorting: false,
  },
];

