export interface KeyRepositoryDatabaseInterface {
  deletePrivateKeyByEmail(email: string): Promise<boolean | Error>;
  deletePublicKeyByEmail(email: string): Promise<boolean | Error>;
  getPublicKey(email: string): Promise<any[] | Error>;
  getPrivateKey(email: string): Promise<any[] | Error>;
}
