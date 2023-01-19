import * as types from './types';

export interface OrganizationIconRepositoryInterface {
  create(data: types.CreateOrganizationIconData): Promise<boolean | Error>;
  delete(organizationId: string): Promise<boolean | Error>;
}
