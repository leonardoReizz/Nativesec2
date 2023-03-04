export interface UpdateSafeBoxGroupRequestDTO {
  id: string;
  name: string;
  description: string;
  safeboxes: string[];
  organization: string;
}
