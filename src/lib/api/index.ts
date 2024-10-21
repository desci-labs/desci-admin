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

export interface CommunityAttestation {
  id: number;
  entryAttestationId?: number;
  attestationId: number;
  communityId: number;
  name: string;
  imageUrl: string;
  description: string;
  protected: boolean;
  isRequired: boolean;
  isExternal: boolean;
  communityName: string;
}

export type ApiResponse<T> = { data: T };
type ApiError = { message: string };

export const listCommunitiesQuery = queryOptions({
  queryKey: [tags.communities],
  queryFn: async (context) => {
    console.log("context", context);
    const response = await fetch(`${NODES_API_URL}/v1/admin/communities`, {
      credentials: "include",
    });
    console.log("fetch list", response.ok, response.status);
    const json = (await response.json()) as ApiResponse<Community[]>;
    return json.data ?? [];
  },
});

export const attestationQueryOptions = (id: number) => {
  console.log()
  return queryOptions({
    queryKey: [{ type: tags.attestations, id }],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${NODES_API_URL}/v1/admin/communities/${id}/attestations`,
          {
            credentials: "include",
          }
        );
        const json = (await response.json()) as ApiResponse<
          CommunityAttestation[]
        >;
        return json.data ?? [];
      } catch (err) {
        console.error({ err })
        return []
      }
    },
  });
};

export interface Attestation {
  id: number;
  name: string;
  communityId: number;
  description: string;
  image_url: string;
  verified_image_url: any;
  templateId: any;
  protected: boolean;
  createdAt: string;
  updatedAt: string;
  community: {
    name: string;
  };
  CommunityEntryAttestation: any[];
}

// export interface Community

export const listAttestationsQuery = queryOptions({
  queryKey: [tags.attestations],
  queryFn: async () => {
    try {
      console.log("[listAttestationsQuery]", tags.attestations);
      const response = await fetch(`${NODES_API_URL}/v1/admin/attestations`, {
        credentials: "include",
      });
      const json = (await response.json()) as ApiResponse<Attestation[]>;
      return json.data ?? [];
    } catch (err) {
      console.log("[listAttestationsQuery]", err);
      return [];
    }
  },
});

export const addEntryAttestation = ({
  communityId,
  attestationId,
}: {
  communityId: number;
  attestationId: number;
}) => {
  return fetch(
    `${NODES_API_URL}/v1/admin/communities/${communityId}/addEntryAttestation/${attestationId}`,
    {
      method: "POST",
      credentials: "include",
    }
  );
};

export const removeEntryAttestation = async ({
  communityId,
  attestationId,
}: {
  communityId: number;
  attestationId: number;
}) => {
  return fetch(
    `${NODES_API_URL}/v1/admin/communities/${communityId}/removeEntryAttestation/${attestationId}`,
    {
      method: "POST",
      credentials: "include",
      // headers: {
      //   'credentials': 'include'
      // }
    }
  );
};

export const addMember = async ({
  communityId,
  userId,
  role,
}: {
  communityId: number;
  userId: number;
  role: string;
}) => {
  const response = await fetch(`/api/member`, {
    body: JSON.stringify({ userId, role, communityId }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

export const removeMember = async ({
  communityId,
  memberId,
}: {
  communityId: number;
  memberId: number;
}) => {
  return fetch(`/api/member`, {
    method: "DELETE",
    body: JSON.stringify({ communityId, memberId }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

interface SearchResponse {
  profiles: [
    {
      name: string;
      id: number;
      orcid: string; //"0009-0000-3482-812X"
      organisations: string[]
    }
  ];
}
export async function searchUsers({ name }: { name?: string }) {
  const response = await fetch(
    `${NODES_API_URL}/v1/users/search?${name && "name=" + name}`,
    {
      credentials: "include",
      mode: "cors",
    }
  );

  const users = response.ok
    ? ((await response.json()) as SearchResponse)?.profiles ?? []
    : [];

  return users;
}

export interface Analytics {
  newUsersInLast30Days: number;
  newUsersInLast7Days: number;
  newUsersToday: number;
  newNodesInLast30Days: number;
  newNodesInLast7Days: number;
  newNodesToday: number;
  activeUsersToday: number;
  activeUsersInLast7Days: number;
  activeUsersInLast30Days: number;
  nodeViewsToday: number;
  nodeViewsInLast7Days: number;
  nodeViewsInLast30Days: number;
  bytesToday: any;
  bytesInLast7Days: number;
  bytesInLast30Days: number;
}

export const getAnalytics = queryOptions({
  queryKey: [tags.analytics],
  queryFn: async () => {
    const response = await fetch(`${NODES_API_URL}/v1/admin/analytics`, {
      credentials: "include",
    });
    const json = (await response.json()) as ApiResponse<Analytics>;
    // return {
    //   "newUsersInLast30Days": 5,
    //   "newUsersInLast7Days": 2,
    //   "newUsersToday": 0,
    //   "newNodesInLast30Days": 2292,
    //   "newNodesInLast7Days": 454,
    //   "newNodesToday": 0,
    //   "activeUsersToday": 1,
    //   "activeUsersInLast7Days": 11,
    //   "activeUsersInLast30Days": 17,
    //   "nodeViewsToday": 2,
    //   "nodeViewsInLast7Days": 3485,
    //   "nodeViewsInLast30Days": 14245,
    //   "bytesToday": null,
    //   "bytesInLast7Days": 22890864,
    //   "bytesInLast30Days": 77358695
    // }
    return json.data ?? null;
  },
  staleTime: 60 * 1000
});
