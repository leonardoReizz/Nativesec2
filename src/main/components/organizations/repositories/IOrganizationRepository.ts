import { ICreateOrganization } from 'main/ipc/organizations/types';

export interface IOrganizationRepository {
  create(organization: ICreateOrganization): Promise<any>;
}
