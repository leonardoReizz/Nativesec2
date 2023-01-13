export interface KeyRepositoryDatabaseInterface {
  delete(email: string): Promise<boolean | Error>;
}
