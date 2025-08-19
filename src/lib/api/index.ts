import { queryOptions } from "@tanstack/react-query";
import { tags } from "../tags";
import { getNodesConfig, NODES_API_URL, RETURN_DEV_TOKEN } from "../config";
import { getHeaders } from "../utils";
import { DateRange } from "react-day-picker";
import { AnalyticsData } from "@/data/schema";
import {
  FeatureAdoptionMetrics,
  PublishingFunnelMetricsData,
  ResearchObjectStats,
  RetentionMetrics,
  UserEngagementMetricsData,
} from "@/types/metrics";
import { endOfDay } from "date-fns";
import { forwardCrossDomainCookie } from "./cookies";

console.log("[NODES_API_URL]:", NODES_API_URL);
export const IPFS_GATEWAY_URL =
  process.env.NEXT_PUBLIC_IPFS_RESOLVER_OVERRIDE ||
  "https://ipfs.desci.com/ipfs";

export class ApiError extends Error {
  status: number;
  errors?: { field: string; message: string }[];

  constructor(
    status: number,
    message: string,
    errors?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...forwardCrossDomainCookie(),
    },
    credentials: "include",
    ...options,
  };

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    let body: any = null;
    try {
      body = await response.json();
    } catch {
      console.error("Error parsing response body", response);
    }
    throw new ApiError(
      response.status,
      body?.message || response.statusText || "Unknown error",
      body?.errors
    );
  }

  return await response.json();
}

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

// type ApiError = { message: string };

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
    const response = await apiRequest<ApiResponse<{ journals: Journal[] }>>(
      `${NODES_API_URL}/v1/journals`
    );
    return response.data?.journals ?? [];
  },
});

export const listCommunitiesQuery = queryOptions({
  queryKey: [tags.communities],
  retry: 1,
  queryFn: async (context) => {
    const response = await apiRequest<ApiResponse<Community[]>>(
      `${NODES_API_URL}/v1/admin/communities`
    );
    return response.data ?? [];
  },
});

export const attestationQueryOptions = (id: number) => {
  return queryOptions({
    queryKey: [{ type: tags.attestations, id }],
    queryFn: async () => {
      try {
        const response = await apiRequest<ApiResponse<CommunityAttestation[]>>(
          `${NODES_API_URL}/v1/admin/communities/${id}/attestations`
        );
        return response.data ?? [];
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
      const response = await apiRequest<ApiResponse<Attestation[]>>(
        `${NODES_API_URL}/v1/admin/attestations`
      );
      return response.data ?? [];
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
  return apiRequest(
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
  return apiRequest(
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
  return apiRequest(
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
  const response = await apiRequest(`/api/member`, {
    body: JSON.stringify({ userId, role, communityId }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders(),
    },
  });

  return response;
};

export const removeMember = async ({
  communityId,
  memberId,
}: {
  communityId: number;
  memberId: number;
}) => {
  return apiRequest(`/api/member`, {
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
    const response = await apiRequest<Analytics>(
      `${NODES_API_URL}/v1/admin/analytics`
    );
    return response;
  },
  staleTime: 60 * 1000,
});

export const sendMagicLink = ({ email }: { email: string }) => {
  return apiRequest(`${NODES_API_URL}/v1/auth/magic`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email }),
  }) as Promise<{ email: string }>;
};

export const verifyCode = ({
  email,
  code,
}: {
  email: string;
  code: string;
}) => {
  return apiRequest(`${NODES_API_URL}/v1/auth/magic`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      email,
      code,
      ...(RETURN_DEV_TOKEN && { dev: true }),
    }),
  }) as Promise<{
    ok: boolean;
    user: {
      email: string;
      isGuest: boolean;
      termsAccepted: boolean;
      token: string;
    };
  }>;
};

export const authUser = queryOptions({
  queryKey: [tags.profile],
  queryFn: async () => {
    try {
      const response = await apiRequest<{
        userId: number;
        email: string;
        profile: {
          name?: string;
          googleScholarUrl: string;
          orcid?: string;
          consent: boolean;
        };
      }>(`${NODES_API_URL}/v1/auth/profile`);
      console.log("[authUser]:: ", response);
      return response;
    } catch (err) {
      console.error("[authUser]:: ", err);
      return null;
    }
  },
});

export const validateAuth = queryOptions({
  queryKey: [],
  queryFn: async () => {
    const response = await apiRequest<{ ok: boolean }>(
      `${NODES_API_URL}/v1/auth/check`
    );
    return response.ok || false;
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
    const response = await apiRequest<
      ApiResponse<PaginatedApiResponse<UserProfile[]>>
    >(`${NODES_API_URL}/v1/admin/users/search`);
    return response.data;
  },
});

export const toggleUserRole = async ({ userId }: { userId: number }) => {
  return apiRequest(`${NODES_API_URL}/v1/admin/users/${userId}/toggleRole`, {
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
  const response = await apiRequest<
    ApiResponse<{ analytics: AnalyticsData[]; meta: any }>
  >(
    `${NODES_API_URL}/v1/admin/analytics/query?from=${range.from}&to=${range.to}&interval=${interval}`,
    {
      credentials: "include",
      mode: "cors",
    }
  );
  return response?.data?.analytics ?? [];
}

export async function getUserEngagementMetrics(): Promise<UserEngagementMetricsData> {
  try {
    const response = await apiRequest<ApiResponse<UserEngagementMetricsData>>(
      `${NODES_API_URL}/v1/admin/metrics/user-engagements`,
      {
        credentials: "include",
        mode: "cors",
      }
    );
    return response.data;
  } catch (err) {
    console.log("[getUserEngagementMetrics]:: ", err);

    return {
      activeUsers: {
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
      publishingUsers: {
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
      exploringUsers: {
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
    };
  }
}

export async function getPublishingFunnelMetrics(query: {
  from: string;
  to: string;
  compareToPreviousPeriod: boolean;
}): Promise<PublishingFunnelMetricsData> {
  const url = new URL(`${NODES_API_URL}/v1/admin/metrics/publish-metrics`);
  if (query?.from)
    url.searchParams.set("from", endOfDay(query.from).toISOString());
  if (query?.to) url.searchParams.set("to", endOfDay(query.to).toISOString());
  if (query?.compareToPreviousPeriod)
    url.searchParams.set("compareToPreviousPeriod", "true");

  try {
    const response = await apiRequest<ApiResponse<PublishingFunnelMetricsData>>(
      url.toString(),
      {
        credentials: "include",
        mode: "cors",
      }
    );
    return response.data;
  } catch (err) {
    console.log("[getPublishingFunnelMetrics]:: ", err);
    return {
      totalUsers: 0,
      publishers: 0,
      publishersInCommunity: 0,
      guestSignUpSuccessRate: 0,
    };
  }
}

export async function getResearchObjectMetrics(query?: {
  from: string;
  to: string;
  compareToPreviousPeriod: boolean;
}): Promise<ResearchObjectStats> {
  const url = new URL(
    `${NODES_API_URL}/v1/admin/metrics/research-object-metrics`
  );
  if (query?.from)
    url.searchParams.set("from", endOfDay(query.from).toISOString());
  if (query?.to) url.searchParams.set("to", endOfDay(query.to).toISOString());
  if (query?.compareToPreviousPeriod)
    url.searchParams.set("compareToPreviousPeriod", "true");

  try {
    const response = await apiRequest<ApiResponse<ResearchObjectStats>>(
      url.toString(),
      {
        credentials: "include",
        mode: "cors",
      }
    );
    return response.data;
  } catch (err) {
    console.log("[getResearchObjectMetrics]:: ", err);
    return {
      totalRoCreated: 0,
      averageRoCreatedPerUser: 0,
      medianRoCreatedPerUser: 0,
    };
  }
}

export async function getRetentionMetrics(): Promise<RetentionMetrics> {
  const url = new URL(`${NODES_API_URL}/v1/admin/metrics/retention-metrics`);

  try {
    const response = await apiRequest<ApiResponse<RetentionMetrics>>(
      url.toString(),
      {
        credentials: "include",
        mode: "cors",
      }
    );
    return response.data;
  } catch (err) {
    console.log("[getRetentionMetrics]:: ", err);
    return {
      day1Retention: 0,
      day7Retention: 0,
      day30Retention: 0,
      day365Retention: 0,
    };
  }
}

export async function getFeatureAdoptionMetrics(query?: {
  from?: Date;
  to?: Date;
  compareToPreviousPeriod: boolean;
}): Promise<FeatureAdoptionMetrics> {
  const url = new URL(
    `${NODES_API_URL}/v1/admin/metrics/feature-adoption-metrics`
  );

  if (query?.from)
    url.searchParams.set("from", endOfDay(query.from).toISOString());
  if (query?.to) url.searchParams.set("to", endOfDay(query.to).toISOString());
  if (query?.compareToPreviousPeriod)
    url.searchParams.set("compareToPreviousPeriod", "true");

  try {
    const response = await apiRequest<ApiResponse<FeatureAdoptionMetrics>>(
      url.toString(),
      {
        credentials: "include",
        mode: "cors",
      }
    );
    return response.data;
  } catch (err) {
    console.log("[getFeatureAdoptionMetrics]:: ", err);
    return {
      totalShares: 0,
      totalCoAuthorInvites: 0,
      totalAIAnalyticsClicks: 0,
      totalMatchedArticleClicks: 0,
      totalClaimedBadges: 0,
      totalProfileViews: 0,
      totalGuestModeVisits: 0,
    };
  }
}
