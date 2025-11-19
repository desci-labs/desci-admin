"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { IpUsage } from "./schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<IpUsage>[] = [
  {
    accessorKey: "ip_address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP Address" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("ip_address")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "total_hits",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Hits" />
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
      <DataTableColumnHeader column={column} title="Guest Hits" />
    ),
    cell: ({ row }) => {
      const anonHits = row.getValue("anon_hits") as number;
      const isHighUsage = anonHits > 100;
      return (
        <div className="text-center">
          <Badge
            variant={isHighUsage ? "destructive" : "secondary"}
            className="font-semibold"
          >
            {anonHits}
          </Badge>
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "auth_hits",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auth Hits" />
    ),
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground">
        {row.getValue("auth_hits")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "anon_pct",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Guest %" />
    ),
    cell: ({ row }) => {
      const pct = row.getValue("anon_pct") as number;
      const isHighPct = pct >= 80;
      return (
        <div className="text-center">
          <Badge variant={isHighPct ? "destructive" : "outline"}>
            {pct.toFixed(1)}%
          </Badge>
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
];

