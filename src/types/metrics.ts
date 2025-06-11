export interface RetentionMetrics {
  day1Retention: number;
  day7Retention: number;
  day30Retention: number;
  day365Retention: number;
}

export interface ResearchObjectStats {
  totalRoCreated: number;
  averageRoCreatedPerUser: number;
  medianRoCreatedPerUser: number;
  previousPeriod?: {
    totalRoCreated: number;
    averageRoCreatedPerUser: number;
    medianRoCreatedPerUser: number;
  };
}

export interface FeatureAdoptionMetrics {
  totalShares: number;
  totalCoAuthorInvites: number;
  totalAIAnalyticsClicks: number;
  totalMatchedArticleClicks: number;
  totalClaimedBadges: number;
  totalProfileViews: number;
  totalGuestModeVisits: number;
}

export interface MetricCardProps {
  title: string;
  value: number;
  valueFormat?: "percent" | "number";
  description?: string;
  trend?: number;
  isLoading?: boolean;
}

export interface UserEngagementMetricsData {
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  publishingUsers: {
    researchObjectsCreated: number;
    researchObjectsUpdated: number;
    researchObjectsShared: number;
    researchObjectsPublished: number;
    communityPublications: number;
  };
  exploringUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface PublishingFunnelMetricsData {
  totalUsers: number;
  publishers: number;
  publishersInCommunity: number;
  guestSignUpSuccessRate: number;
  previousPeriod?: {
    totalUsers: number;
    publishers: number;
    publishersInCommunity: number;
    guestSignUpSuccessRate: number;
  };
}
