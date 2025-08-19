"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { roles } from "./data/data";
import { User } from "./data/schema";
import { DicesIcon } from "lucide-react";

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("name")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return (
        (row.getValue(id) as string)
          ?.toLowerCase()
          ?.includes((value as string).toLowerCase()) ||
        (row.getValue("email") as string)
          ?.toLowerCase()
          ?.includes((value as string).toLowerCase())
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const isDesciEmail = (row.getValue("email") as string)?.endsWith(
        "@desci.com"
      );
      return (
        <div className="flex gap-1 items-center text-ellipsis">
          <span>{row.getValue("email")}</span>
          {isDesciEmail ? (
            <DicesIcon className="mr-l h-4 w-4 text-muted-foreground" />
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "isAdmin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const isAdmin = row.getValue("isAdmin") === true;
      const role = roles.find((status) =>
        isAdmin ? status.value === "admin" : status.value === "user"
      );

      if (!role) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {role.icon && (
            <role.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{isAdmin ? "Admin" : "User"}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const isAdmin = row.getValue("isAdmin") === true;
      return value.includes(isAdmin ? "admin" : "user");
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date Created" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("createdAt")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
