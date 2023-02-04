import { store } from '../../../../main';
import { IKeys, IToken } from '../../../../types';
import { refreshOrganizations } from '../../electronstore/store';
import { OrganizationModelAPI } from '../../model/Organization';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { organizationComparator } from './comparators/organizationComparator';
import { iconsComparator } from './comparators/organizationIconComparator';

export class RefreshOrganizationsUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase
  ) {}

  async execute() {
    let iconeAllResponse = false;
    let organizationsResponse = false;

    const { tokenType, accessToken } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const listAPI = await this.organizationRepositoryAPI.list(authorization);
    const listDatabase = await this.organizationRepositoryDatabase.list();

    if (listAPI.status === 200 && listAPI.data.status === 'ok') {
      const apiOrganizations: OrganizationModelAPI[] = listAPI.data.msg;

      const organizationInfo: OrganizationModelAPI[] = await Promise.all(
        apiOrganizations.map(async (org: OrganizationModelAPI) => {
          const APIGetOrganization =
            await this.organizationRepositoryAPI.getOrganization(
              authorization,
              org._id.$oid
            );

          return APIGetOrganization?.data?.msg[0];
        })
      );

      if (organizationInfo.length > 0) {
        const keys = store.get('keys') as IKeys;
        if (keys.publicKey !== undefined) {
          organizationsResponse = await organizationComparator(
            organizationInfo,
            this.organizationRepositoryDatabase
          );
        }
      }

      const APIListOrganizationIcons =
        await this.organizationRepositoryAPI.listIcons(authorization);

      if (
        APIListOrganizationIcons.status === 200 &&
        APIListOrganizationIcons.data.status === 'ok'
      ) {
        if (APIListOrganizationIcons?.data?.msg.length > 0) {
          const keys = store.get('keys') as IKeys;
          if (keys.publicKey !== undefined) {
            iconeAllResponse = await iconsComparator(
              APIListOrganizationIcons?.data?.msg
            );
          }
        }

        await refreshOrganizations(
          this.organizationRepositoryDatabase,
          this.organizationIconRepositoryDatabase
        );

        return {
          message: 'ok',
          data: {
            organizationsResponse,
            iconeAllResponse,
          },
        };
      }

      throw new Error('ERRO API GET ORGANIZATIONS ICONS');
    }

    throw new Error('ERRO API GET ORGANIZATIONS');
  }
}
