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

type ApiResponse<T> = { data: T };
type ApiError = { message: string };
export const listCommunitiesQuery = queryOptions({
  queryKey: [tags.communities],
  queryFn: async () => {
    const response = await fetch(`${NODES_API_URL}/v1/admin/communities`, {
      credentials: "include",
    });
    console.log("fetch list", response.ok);
    // if (response.ok) {
    const json = (await response.json()) as ApiResponse<Community[]>;
    return json.data;
    // }
    // return await response.json(); // as ApiError;
  },
});

export const attestationQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: [{ type: tags.attestations, id }],
    queryFn: async () => {
      const response = await fetch(
        `${NODES_API_URL}/v1/admin/communities/${id}/attestations`,
        {
          credentials: "include",
        }
      );
      const json = (await response.json()) as ApiResponse<
        CommunityAttestation[]
      >;
      return json.data;
      // return (await response.json()) // as ApiError
    },
    // staleTime: 10 * 1000,
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
    const response = await fetch(`${NODES_API_URL}/v1/admin/attestations`, {
      credentials: "include",
    });
    console.log("fetch list", response.ok);
    // if (response.ok) {
    const json = (await response.json()) as ApiResponse<Attestation[]>;
    return json.data;
    // }
    // return await response.json(); // as ApiError
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
