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

export interface ICreateSafeBoxGroupData {
  name: string;
  description: string;
  safeBoxes: string[];
  organization: string;
}
