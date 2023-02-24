import { ISafeBoxGroupModelDatabase } from '../model/safe-box-group';

export interface ISafeBoxGroupRepositoryDatabaseInterface {
  listByOrganizationId(
    organizationId: string
  ): Promise<ISafeBoxGroupModelDatabase[] | Error>;
  list(): Promise<ISafeBoxGroupModelDatabase[] | Error>;
  create(safeBoxGroup: ISafeBoxGroupModelDatabase): Promise<Error | true>;
}
