"use client";
import { DataTable } from "@/components/organisms/users-datatable/data-table";
import { users } from "@/components/organisms/users-datatable/data/users";
import { columns } from "@/components/organisms/users-datatable/columns";
import { searchUsers } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { LoaderCircleIcon } from "lucide-react";

const queryClient = getQueryClient();

export default function UsersTable() {
  const { data, isLoading, error } = useQuery(searchUsers, queryClient);

  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your users on nodes platform
          </p>
        </div>
      </div>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        {isLoading ? (
          <div className="">
            <LoaderCircleIcon className="w-18 h-18" />
          </div>
        ) : (
          <DataTable data={data?.data?.data ?? []} columns={columns} />
        )}
      </div>
    </>
  );
}
