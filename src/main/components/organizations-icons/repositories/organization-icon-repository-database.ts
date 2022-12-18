/* eslint-disable class-methods-use-this */
import * as types from './types';
import { OrganizationIconRepositoryInterface } from './organization-icon-repository-interface';

export class OrganizationIconRepositoryDatabase
  implements OrganizationIconRepositoryInterface
{
  async create(
    data: types.CreateOrganizationIconData
  ): Promise<boolean | Error> {
    return true;
  }
}
