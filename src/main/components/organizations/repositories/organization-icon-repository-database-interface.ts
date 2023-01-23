import * as types from './types';

export interface IOrganizationIconRepositoryDatabase {
  create(data: types.ICreateOrganizationIconData): Promise<boolean | Error>;
  delete(organizationId: string): Promise<boolean | Error>;
  update: (organizationId: string, icon: string) => Promise<boolean | Error>;
}
