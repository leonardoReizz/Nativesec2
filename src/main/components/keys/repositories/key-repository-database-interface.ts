export interface KeyRepositoryDatabaseInterface {
  delete(email: string): Promise<boolean | Error>;
  getPublicKey(email: string): Promise<any[] | Error>;
}
