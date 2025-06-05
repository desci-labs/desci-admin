"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

import { statuses } from "./data/data";
import { Community } from "./data/schema";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const columns: ColumnDef<Community>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
  },
  // {
  //   accessorKey: "image_url",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Logo" />
  //   ),
  //   cell: ({ row }) => (
  //     <Avatar>
  //       <AvatarImage src={row.getValue("image_url")} />
  //     </Avatar>
  //   ),
  //   enableSorting: false,
  // },
  {
    id: "logo",
    header: ({ table }) => (
      <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
        Icon
      </span>
    ),
    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={row.getValue("image_url")} />
      </Avatar>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        // <div className="flex space-x-2">
        <Link
          href={`/communities/${row.getValue("id")}`}
          className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem] hover:text-blue-5"
        >
          {row.getValue("name")}
        </Link>
        // </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "subtitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subtitle" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("subtitle")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue("slug")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "hidden",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visibility" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === !row.getValue("hidden")
      );

      if (!status) return null;

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon
              className={cn(
                "mr-2 h-4 w-4 text-muted-foreground",
                status.value ? "text-success-foreground" : "text-danger"
              )}
            />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes((!row.getValue(id) as boolean).toString());
    },
    enableSorting: false,
  },
  // {
  //   accessorKey: "description",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Description" />
  //   ),
  //   cell: ({ row }) => {
  //     const label = row.original.description;

  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
  //           {label}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "keywords",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Keywords" />
    ),
    cell: ({ row }) => {
      const keywords = row.original.keywords;

      return (
        <div className="flex space-x-2">
          {keywords?.slice(0, 2).map((label, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]"
            >
              {label}
            </Badge>
          ))}
          {keywords?.length > 2 && (
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem] text-success">
              + {keywords.length - 2}
            </span>
          )}
        </div>
      );
    },
    enableHiding: true,
    enableSorting: false,
    // enableResizing: true,
  },
  // {
  //   accessorKey: "image_url",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Image url" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
  //           {row.getValue("image_url")}
  //         </span>
  //       </div>
  //     );
  //   },
  //   enableSorting: false,
  // },
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
  // {
  //   accessorKey: "updatedAt",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Last Updated" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
  //           {row.getValue("updatedAt")}
  //         </span>
  //       </div>
  //     );
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
