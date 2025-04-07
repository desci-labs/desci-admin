export type Usage = {
  owner: string;
  status: string;
  costs: number;
  region: string;
  stability: number;
  lastEdited: string;
};

export type AnalyticsData = {
  date: string;
  newNodes: number;
  publishedNodes: number;
  nodeViews: number;
  bytes: number;
  "Downloaded data": number;
  newUsers: number;
  newOrcidUsers: number;
  activeUsers: number;
  activeOrcidUsers: number;
  downloadedBytes: number;
  nodeLikes: number;
  badgeVerifications: number;
  communitySubmissions: number;
};
