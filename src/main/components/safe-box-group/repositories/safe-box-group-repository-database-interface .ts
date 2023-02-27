import { ISafeBoxGroupModelDatabase } from '../model/safe-box-group';

export interface ISafeBoxGroupRepositoryDatabaseInterface {
  listByOrganizationId(
    organizationId: string
  ): Promise<ISafeBoxGroupModelDatabase[] | Error>;
  list(): Promise<ISafeBoxGroupModelDatabase[] | Error>;
  create: (safeBoxGroup: ISafeBoxGroupModelDatabase) => Promise<Error | true>;
  deleteById: (safeBoxGroupId: string) => Promise<Error | true>;
  update: (
    safeBoxGroup: Omit<
      ISafeBoxGroupModelDatabase,
      'dono' | 'organizacao' | 'data_hora_create'
    >
  ) => Promise<Error | true>;
}
