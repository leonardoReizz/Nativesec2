export interface KeyRepositoryDatabaseInterface {
  delete(email: string): Promise<boolean | Error>;
  getPublicKey(email: string): Promise<any[] | Error>;
  getPrivateKey(email: string): Promise<any[] | Error>;
}
