import { IUserConfigDatabaseModel } from '../Model/User';

export interface UserConfigRepositoryDatabaseInterface {
  update: (data: IUserConfigDatabaseModel) => Promise<boolean | Error>;
  getUserConfig: (email: string) => Promise<IUserConfigDatabaseModel[] | Error>;
  create: (data: IUserConfigDatabaseModel) => Promise<boolean | Error>;
}
