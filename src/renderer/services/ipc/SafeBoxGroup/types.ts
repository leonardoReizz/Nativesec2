export interface IUpdateSafeBoxGroupData {
  id: string;
  name: string;
  description: string;
  safeboxes: string[];
  organization: string;
}

export interface IDeleteSafeBoxGroupData {
  organizationId: string;
  safeBoxGroupId: string;
}
