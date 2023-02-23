export interface KeyDatabase {
  email: string;
  full_name: string;
  private_key: string;
  workspaceId: string;
  type: string;
}

export interface IPrivateKeyAPIModel {
  _id: {
    $oid: string;
  };
  chave: string;
  tipo: string;
  email: string;
}

export interface IPublicKeyAPIModel {
  _id: {
    $oid: string;
  };
  chave: string;
  tipo: string;
  email: string;
}
