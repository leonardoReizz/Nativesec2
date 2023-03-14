export interface IUserAPIModel {
  full_name: string;
  email: string;
  disabled: boolean;
}

export interface IUserConfigDatabaseModal {
  savePrivateKey: string;
  refreshTime: number;
  theme: string;
  lastOrganizationId: string;
  email: string;
}
