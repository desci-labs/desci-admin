export interface RetentionMetrics {
  day1Retention: number;
  day7Retention: number;
  day30Retention: number;
  day365Retention: number;
}

export interface ResearchObjectStats {
  averageROsPerResearcher: number;
  medianROsPerResearcher: number;
  totalROsCreated: number;
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
  description?: string;
  trend?: number;
  isLoading?: boolean;
}
