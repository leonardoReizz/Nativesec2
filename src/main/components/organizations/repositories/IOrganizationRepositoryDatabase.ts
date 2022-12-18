import { ICreateOrganization } from 'main/ipc/organizations/types';

export interface Create {
  createOrganization: boolean | Error | null;
  createOrganizationIcon: boolean | Error | null;
}

export interface IOrganizationRepositoryDatabase {
  create(organization: ICreateOrganization): Promise<boolean | Error>;
  delete(organizationId: string): Promise<boolean | Error>;
}
