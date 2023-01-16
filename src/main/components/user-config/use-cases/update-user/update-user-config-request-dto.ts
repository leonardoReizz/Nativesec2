export interface UpdateUserConfigRequestDTO {
  lastOrganizationId: string;
  refreshTime: string;
  theme: string;
  savePrivateKey: string;
  email: string;
  type?: string;
}
