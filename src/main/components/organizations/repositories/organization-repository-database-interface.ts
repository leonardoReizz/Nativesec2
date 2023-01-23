import { OrganizationModelDatabase } from '../model/Organization';

export interface Create {
  createOrganization: boolean | Error | null;
  createOrganizationIcon: boolean | Error | null;
}

export interface IOrganizationRepositoryDatabase {
  create(organization: OrganizationModelDatabase): Promise<boolean | Error>;
  delete(organizationId: string): Promise<boolean | Error>;
  findById(
    organizationId: string
  ): Promise<OrganizationModelDatabase | undefined | Error>;
  update(data: OrganizationModelDatabase): Promise<boolean | Error>;
}
