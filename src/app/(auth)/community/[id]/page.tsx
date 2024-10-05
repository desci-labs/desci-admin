"use client";

import {
  useSuspenseQuery,
} from "@tanstack/react-query";
import { listCommunitiesQuery } from "@/lib/api";

export default function CommunityDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  console.log("details page", params.id);
  const { data, isLoading } = useSuspenseQuery(listCommunitiesQuery);
  const community = data?.data?.find((com) => com.id === parseInt(params.id));

  console.log('details', { community, id: params.id })
  return (
    <p>{community?.name}</p>
  );
}
