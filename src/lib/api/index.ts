import { queryOptions } from "@tanstack/react-query";
import { tags } from "../tags";
import { NODES_API_URL } from "../config";
import { AUTH_COOKIE_FIELDNAME } from "../constants";
import { getHeaders } from "../utils";
import { DateRange } from "react-day-picker";
import { AnalyticsData } from "@/data/schema";
import {
  PublishingFunnelMetricsData,
  UserEngagementMetricsData,
} from "@/types/metrics";

// import { cookies } from "next/headers";

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
export type PaginatedApiResponse<T> = {
  data: T;
  count: number;
  page: number;
  cursor: number;
};

type ApiError = { message: string };

export interface Journal {
  id: number;
  name: string;
  description: string;
  iconCid: string;
  createdAt: string;
}

export const listJournalsQuery = queryOptions({
  queryKey: [tags.journals],
  retry: 1,
  queryFn: async (context) => {
    const response = await fetch(`${NODES_API_URL}/v1/journals`, {
      credentials: "include",
      // headers: getHeaders(),
    });
    const json = (await response.json()) as ApiResponse<{
      journals: Journal[];
    }>;
    console.log("fetch list", response.ok, response.status, json);
    return json.data?.journals ?? [];
  },
});

export const listCommunitiesQuery = queryOptions({
  queryKey: [tags.communities],
  retry: 1,
  queryFn: async (context) => {
    const response = await fetch(`${NODES_API_URL}/v1/admin/communities`, {
      credentials: "include",
      // headers: getHeaders(),
    });
    console.log("fetch list", response.ok, response.status);
    const json = (await response.json()) as ApiResponse<Community[]>;
    return json.data ?? [];
  },
});

export const attestationQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: [{ type: tags.attestations, id }],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${NODES_API_URL}/v1/admin/communities/${id}/attestations`,
          {
            credentials: "include",
            // headers: getHeaders(),
          }
        );
        const json = (await response.json()) as ApiResponse<
          CommunityAttestation[]
        >;
        return json.data ?? [];
      } catch (err) {
        console.error({ err });
        return [];
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
  canMintDoi: boolean;
  canUpdateOrcid: boolean;
  createdAt: string;
  updatedAt: string;
  community: {
    name: string;
  };
  CommunityEntryAttestation: any[];
}

export const listAttestationsQuery = queryOptions({
  queryKey: [tags.attestations],
  queryFn: async () => {
    try {
      console.log("[listAttestationsQuery]", tags.attestations);
      const response = await fetch(`${NODES_API_URL}/v1/admin/attestations`, {
        credentials: "include",
        // headers: getHeaders(),
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
      // headers: getHeaders(),
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
      // headers: getHeaders(),
    }
  );
};

export const toggleEntryAttestationRequirement = async ({
  communityId,
  entryId,
}: {
  communityId: number;
  entryId: number;
}) => {
  return fetch(
    `${NODES_API_URL}/v1/admin/communities/${communityId}/toggleEntryAttestation/${entryId}`,
    {
      method: "POST",
      credentials: "include",
      // headers: getHeaders(),
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
      ...getHeaders(),
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
      ...getHeaders(),
    },
  });
};

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

  bytesToday: number;
  bytesInLast7Days: number;
  bytesInLast30Days: number;

  downloadedBytesToday: number;
  downloadedBytesInLast7Days: number;
  downloadedBytesInLast30Days: number;

  newOrcidUsersToday: number | string;
  newOrcidUsersInLast7Days: number | string;
  newOrcidUsersInLast30Days: number | string;

  activeOrcidUsersToday: number;
  activeOrcidUsersInLast7Days: number;
  activeOrcidUsersInLast30Days: number;

  allUsers: number;
  allOrcidUsers: number;
  allExternalUsers: number;

  publishedNodesToday: number;
  publishedNodesInLast7Days: number;
  publishedNodesInLast30Days: number;

  nodeLikesToday: number;
  nodeLikesInLast7Days: number;
  nodeLikesInLast30Days: number;

  communitySubmissionsInLast7Days: number;
  communitySubmissionsInLast30Days: number;
  communitySubmissionsToday: number;

  badgeVerificationsToday: number;
  badgeVerificationsInLast7Days: number;
  badgeVerificationsInLast30Days: number;
}

export interface AnalyticsUser {
  id: number;
  email: string;
  orcid?: string;
  publications?: number;
  dateJoined?: string;
}

export interface AnalyticsOrcidUser extends AnalyticsUser {
  publications?: number;
  dateJoined?: string;
}

export const getAnalytics = queryOptions({
  queryKey: [tags.analytics],
  queryFn: async () => {
    // console.log('[cookies]', cookies().toString())
    const response = await fetch(`${NODES_API_URL}/v1/admin/analytics`, {
      credentials: "include",
      // headers: getHeaders(),
    });
    const json = (await response.json()) as Analytics;
    return json || null;
  },
  staleTime: 60 * 1000,
});

// export const getAnalyticsData = queryOptions({
//   queryKey: [tags.analyticsChartData],
//   queryFn: async (range: DateRange) => {
//     // const response = await fetch(`${NODES_API_URL}/v1/admin/analyticsChartData`, {
//     //   credentials: "include",
//     // });
//     // const json = (await response.json()) as Analytics;
//     // return json || null;
//     await new Promise((resolve) => setTimeout(resolve, 3000));
//     return overviews;
//   },
// });

export const authUser = queryOptions({
  queryKey: [tags.profile],
  queryFn: async () => {
    const response = await fetch(`${NODES_API_URL}/v1/auth/profile`, {
      credentials: "include",
    });
    const json = (await response.json()) as {
      userId: number;
      email: string;
      profile: {
        name?: string;
        googleScholarUrl: string;
        orcid?: string;
        // userOrganization: Organization[];
        consent: boolean;
        // notificationSettings: any;
      };
    };
    return json || false;
  },
});

export const validateAuth = queryOptions({
  queryKey: [],
  queryFn: async () => {
    const response = await fetch(`${NODES_API_URL}/v1/auth/check`, {
      credentials: "include",
      // headers: getHeaders(),
    });
    const json = (await response.json()) as { ok: boolean };
    return json.ok || false;
  },
});

interface UserProfile {
  id: number;
  name: string;
  email: string;
  orcid: string;
  isAdmin: boolean;
  createdAt: string;
}

export const searchUsers = queryOptions({
  queryKey: [tags.users],
  queryFn: async (context) => {
    console.log("context", context);
    const response = await fetch(`${NODES_API_URL}/v1/admin/users/search`, {
      credentials: "include",
      // headers: getHeaders(),
    });
    console.log("fetch users", response.ok, response.status);
    const json = (await response.json()) as {
      data: PaginatedApiResponse<UserProfile[]>;
    };
    return json;
  },
});

export const toggleUserRole = async ({ userId }: { userId: number }) => {
  return fetch(`${NODES_API_URL}/v1/admin/users/${userId}/toggleRole`, {
    method: "PATCH",
    credentials: "include",
    // headers: getHeaders(),
  });
};

interface SearchResponse {
  data: {
    count: number;
    cursor: number;
    page: number;
    data: [
      {
        name: string;
        id: number;
        email: string;
        isAdmin: boolean;
        orcid: string; //"0009-0000-3482-812X"
        organisations?: string[];
      }
    ];
  };
}

export async function searchUsersProfiles({ name }: { name?: string }) {
  const response = await fetch(
    `${NODES_API_URL}/v1/admin/users/search?${name ? "name=" + name : ""}`,
    {
      credentials: "include",
      // headers: getHeaders(),
      mode: "cors",
    }
  );

  const users = response.ok
    ? ((await response.json()) as SearchResponse) ?? []
    : null;

  return users;
}

export async function getAnalyticsData(range: DateRange, interval: string) {
  const response = await fetch(
    `${NODES_API_URL}/v1/admin/analytics/query?from=${range.from}&to=${range.to}&interval=${interval}`,
    {
      credentials: "include",
      mode: "cors",
    }
  );

  const data = response.ok
    ? ((await response.json()) as {
        data: { analytics: AnalyticsData[]; meta: any };
      }) ?? []
    : undefined;

  console.log("[data]", data?.data.analytics);
  return data?.data.analytics;
}

export async function getUserEngagementMetrics(): Promise<UserEngagementMetricsData> {
  const response = await fetch(
    `${NODES_API_URL}/v1/admin/metrics/user-engagements`,
    {
      credentials: "include",
      mode: "cors",
    }
  );

  if (!response.ok) {
    console.log(
      "getUserEngagementMetrics",
      response.status,
      response.statusText
    );
    return {
      activeUsers: {
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
      publishingUsers: {
        researchObjectsCreated: 0,
        researchObjectsUpdated: 0,
        researchObjectsShared: 0,
        researchObjectsPublished: 0,
        communityPublications: 0,
      },
      exploringUsers: {
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
    };
  }

  const data =
    (await response.json()) as ApiResponse<UserEngagementMetricsData>;
  console.log("getUserEngagementMetrics", data);
  return data.data;
}

export async function getPublishingFunnelMetrics(query: {
  from: string;
  to: string;
  compareToPreviousPeriod: boolean;
}): Promise<PublishingFunnelMetricsData> {
  const response = await fetch(
    `${NODES_API_URL}/v1/admin/metrics/publish-metrics?from=${query.from}&to=${
      query.to
    }${query.compareToPreviousPeriod ? "&compareToPreviousPeriod=true" : ""}`,
    {
      credentials: "include",
      mode: "cors",
    }
  );

  if (!response.ok) {
    console.log(
      "getPublishingFunnelMetrics Error",
      response.status,
      response.statusText
    );
    return {
      totalUsers: 0,
      publishers: 0,
      publishersInCommunity: 0,
      guestSignUpSuccessRate: 0,
    };
  }

  const data =
    (await response.json()) as ApiResponse<PublishingFunnelMetricsData>;
  console.log("getPublishingFunnelMetrics", data);
  return data.data;
}
