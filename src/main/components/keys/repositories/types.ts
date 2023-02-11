export interface ICreatePrivateKeyData {
  _id: string;
  email: string;
  fullName: string;
  privateKey: string;
  defaultType: string;
}

export interface ICreatePublicKeyData {
  _id: string;
  email: string;
  fullName: string;
  publicKey: string;
  defaultType: string;
}
