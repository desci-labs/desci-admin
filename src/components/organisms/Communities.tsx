"use client";

import { listCommunitiesQuery } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircleIcon } from "lucide-react";
import { DataTable } from "./community-datatable/data-table";
import { columns } from "./community-datatable/columns";
import { getQueryClient } from "@/lib/get-query-client";

const queryClient = getQueryClient();

export default function Communities() {
  const { data, isLoading, error } = useQuery(
    listCommunitiesQuery,
    queryClient
  );

  return (
    <>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        {isLoading ? (
          <div className="">
            <LoaderCircleIcon className="w-18 h-18" />
          </div>
        ) : (
          <DataTable data={data ?? []} columns={columns} />
        )}
      </div>
    </>
  );
}
