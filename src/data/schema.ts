export type Usage = {
  owner: string;
  status: string;
  costs: number;
  region: string;
  stability: number;
  lastEdited: string;
};

export type OverviewData = {
  date: string;
  "New nodes": number;
  "Published nodes": number;
  "Node views": number;
  'Uploaded data': number;
  "Downloaded data": number;
  "New users": number;
  "New orcid users": number;
  'Active users': number;
  'Active orcid users': number;
};
