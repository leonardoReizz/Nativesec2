export interface KeyDatabase {
  email: string;
  full_name: string;
  private_key: string;
  workspaceId: string;
  type: string;
}

export interface IPrivateKeyApiModel {
  privateKey: string;
  type: string;
}

export interface IPublicKeyApiModel {
  publicKey: string;
  type: string;
}
