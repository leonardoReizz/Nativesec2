/* eslint-disable class-methods-use-this */
import APIOrganization from 'main/API/organizations';
import { ICreateOrganization, IToken } from 'main/ipc/organizations/types';
import { store } from 'main/main';
import { IOrganizationRepository } from './IOrganizationRepository';

export class OrganizationRepositoryAPI implements IOrganizationRepository {
  async create(organization: ICreateOrganization): Promise<any> {
    const { accessToken, tokenType } = store.get('token') as IToken;

    const APICreateOrganization = await APIOrganization.createOrganization({
      data: organization,
      authorization: `${tokenType} ${accessToken}`,
    });

    return {
      status: APICreateOrganization.status,
      data: APICreateOrganization.data,
    };
  }
}
