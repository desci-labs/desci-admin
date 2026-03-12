"use client";

import {
  listJournalApplicationsQuery,
  approveJournalApplication,
  rejectJournalApplication,
  JournalApplication,
} from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { tags } from "@/lib/tags";
import { LoaderCircleIcon, CheckIcon, XIcon, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function StatusBadge({ status }: { status: JournalApplication["status"] }) {
  const variantMap: Record<
    JournalApplication["status"],
    "default" | "secondary" | "destructive" | "outline"
  > = {
    PENDING: "outline",
    APPROVED: "default",
    REJECTED: "destructive",
  };

  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

function ActionsCell({ application }: { application: JournalApplication }) {
  const queryClient = getQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => approveJournalApplication(application.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tags.journalApplications] });
      queryClient.invalidateQueries({ queryKey: [tags.journals] });
      toast.success(`Journal "${application.name}" has been approved.`);
    },
    onError: (error) => {
      toast.error(
        `Failed to approve application: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectJournalApplication(application.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tags.journalApplications] });
      toast.success(`Journal "${application.name}" has been rejected.`);
    },
    onError: (error) => {
      toast.error(
        `Failed to reject application: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });

  if (application.status !== "PENDING") {
    return (
      <span className="text-sm text-muted-foreground">
        {application.status === "APPROVED" ? "Approved" : "Rejected"}
      </span>
    );
  }

  const isLoading = approveMutation.isPending || rejectMutation.isPending;

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="default"
            disabled={isLoading}
            className="h-8"
          >
            {approveMutation.isPending ? (
              <LoaderCircleIcon className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <CheckIcon className="mr-1 h-3 w-3" />
            )}
            Approve
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Journal Application</DialogTitle>
            <DialogDescription>
              This will create the journal &quot;{application.name}&quot; and
              assign the applicant as Chief Editor.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button onClick={() => approveMutation.mutate()}>Approve</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            disabled={isLoading}
            className="h-8"
          >
            {rejectMutation.isPending ? (
              <LoaderCircleIcon className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <XIcon className="mr-1 h-3 w-3" />
            )}
            Reject
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Journal Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject the journal application &quot;
              {application.name}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="destructive"
                onClick={() => rejectMutation.mutate()}
              >
                Reject
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const columns: ColumnDef<JournalApplication>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-sm">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Journal Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <div className="max-w-[300px] truncate">{description}</div>;
    },
  },
  {
    id: "applicant",
    header: "Applicant",
    cell: ({ row }) => {
      const { applicant } = row.original;
      return (
        <div>
          <div className="font-medium">{applicant.name || "N/A"}</div>
          <div className="text-sm text-muted-foreground">{applicant.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Applied At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell application={row.original} />,
  },
];

export default function JournalApplications() {
  const queryClient = getQueryClient();
  const { data, isLoading, error } = useQuery(
    listJournalApplicationsQuery,
    queryClient
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-destructive mb-4">
          Error loading journal applications
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Journal Applications
        </h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <LoaderCircleIcon className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No journal applications found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
