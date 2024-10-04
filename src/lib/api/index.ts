import { queryOptions } from "@tanstack/react-query";
import { tags } from "../tags";
import { NODES_API_URL } from "../config";

type Community = {
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
};

export const listCommunitiesQuery = queryOptions({
  queryKey: [tags.communities],
  queryFn: async () => {
      const response = await fetch(`${NODES_API_URL}/v1/admin/communities`, {
        credentials: "include",
      });
      console.log('fetch list', response.ok);
      return (await response.json()) as { data: Community[] };
  },
});
