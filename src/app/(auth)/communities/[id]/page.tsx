"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { listCommunitiesQuery } from "@/lib/api";
import { LoaderCircleIcon } from "lucide-react";
import CommunityDetails from "@/components/organisms/CommunityDetails";

const attestations = [
  {
    attestationVersion: {
      name: "Scientific Manuscript"
    },
    image_url: "https://pub.desci.com/ipfs/bafkreihcbri63lbk3p5recyr4bligwnntakmiwkklee2qvvk34xvxjstse",
    name: "Scientific Manuscript",
    id: 11
  }
]

export default function CommunityDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading } = useSuspenseQuery(listCommunitiesQuery);
  const community = data?.data?.find(
    (community) => community.id === parseInt(params.id)
  );
  console.log(community)
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
            users={[{ id: 1, name: "shadrach" }]}
            allAttestations={attestations}
          />
        )}
      </div>
    </>
  );
}
