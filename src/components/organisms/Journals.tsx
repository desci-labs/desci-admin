"use client";

import { listJournalsQuery } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { DataTable } from "./journal-datatable/data-table";
import { columns } from "./journal-datatable/columns";
import { getQueryClient } from "@/lib/get-query-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const queryClient = getQueryClient();

export default function Journals() {
  const router = useRouter();
  const { data, isLoading, error } = useQuery(listJournalsQuery, queryClient);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-destructive mb-4">Error loading journals</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Journals</h2>
        <Button onClick={() => router.push("/journals/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Journal
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <LoaderCircleIcon className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <DataTable data={data ?? []} columns={columns} />
      )}
    </div>
  );
}
