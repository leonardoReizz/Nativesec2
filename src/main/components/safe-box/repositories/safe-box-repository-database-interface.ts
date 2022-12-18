import { SafeBoxDatabaseModel } from '../model/SafeBox';

export interface SafeBoxRepositoryDatabaseInterface {
  create: (data: SafeBoxDatabaseModel) => Promise<boolean | Error>;
  delete: (safeBoxId: string) => Promise<boolean | Error>;
}
