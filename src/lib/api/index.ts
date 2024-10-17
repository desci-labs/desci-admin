import { queryOptions } from "@tanstack/react-query";
import { tags } from "../tags";
import { NODES_API_URL } from "../config";

export interface Community {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  image_url: string;
  subtitle: string;
  description: string;
  keywords: string[];
  memberString: string[];
  links: string[];
  hidden: boolean;
  CommunityMember: {
    id: number;
    role: "ADMIN" | "MEMBER";
    userId: number;
    user: {
      name: string;
      userOrganizations: { id: string; name: string }[];
    };
  }[];
  CommunityEntryAttestation: {
    id: number;
    attestationVersion: {
      id: number;
      name: string;
      image_url: string;
    };
  }[];
  engagements: {
    reactions: number;
    annotations: number;
    verifications: number;
  };
  verifiedEngagements: {
    reactions: number;
    annotations: number;
    verifications: number;
  };
}

export const listCommunitiesQuery = queryOptions({
  queryKey: [tags.communities],
  queryFn: async () => {
    const response = await fetch(`${NODES_API_URL}/v1/admin/communities`, {
      credentials: "include",
    });
    console.log("fetch list", response.ok);
    return (await response.json()) as { data: Community[] };
  },
});

// export const listAttestationsQuery = queryOptions({
//   queryKey: [tags.communities],
//   queryFn: async (communityId: string) => {
//       const response = await fetch(`${NODES_API_URL}/v1/admin/communities`, {
//         credentials: "include",
//       });
//       console.log('fetch list', response.ok);
//       return (await response.json()) as { data: Community[] };
//   },
// });
