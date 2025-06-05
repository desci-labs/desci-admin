"use client";

import { useQuery } from "@tanstack/react-query";
import { listCommunitiesQuery, listJournalsQuery } from "@/lib/api";
import { LoaderCircleIcon } from "lucide-react";
import CommunityDetails from "@/components/organisms/CommunityDetails";
import { getQueryClient } from "@/lib/get-query-client";
import JournalDetails from "@/components/organisms/JournalDetails";

export default function JournalDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading } = useQuery(listJournalsQuery, getQueryClient());
  const journal = data?.find((journal) => journal.id === parseInt(params.id));

  return (
    <>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        {isLoading && (
          <div className="">
            <LoaderCircleIcon className="w-18 h-18" />
          </div>
        )}
        {journal && <JournalDetails journal={journal} />}
      </div>
    </>
  );
}
