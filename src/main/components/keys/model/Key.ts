export interface KeyDatabase {
  email: string;
  full_name: string;
  private_key: string;
  workspaceId: string;
  type: string;
}

export interface KeyAPI {
  privateKey: string;
  type: string;
}
