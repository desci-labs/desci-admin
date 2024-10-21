"use client";

import { useQuery } from "@tanstack/react-query";
import { listCommunitiesQuery } from "@/lib/api";
import { LoaderCircleIcon } from "lucide-react";
import CommunityDetails from "@/components/organisms/CommunityDetails";
import { getQueryClient } from "@/lib/get-query-client";

export default function CommunityDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading } = useQuery(listCommunitiesQuery, getQueryClient());
  const community = data?.find(
    (community) => community.id === parseInt(params.id)
  );

  return (
    <>
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        {isLoading && (
          <div className="">
            <LoaderCircleIcon className="w-18 h-18" />
          </div>
        )}
        {community && (
          <CommunityDetails
            community={community}
          />
        )}
      </div>
    </>
  );
}
