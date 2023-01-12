import { UserDatabase } from '../Model/User';

export interface UserConfigRepositoryDatabaseInterface {
  update: (data: UserDatabase) => Promise<boolean | Error>;
}
