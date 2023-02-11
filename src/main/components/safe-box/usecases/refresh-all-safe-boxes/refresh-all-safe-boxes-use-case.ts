import { store } from '../../../../main';
import { IToken } from '../../../../types';
import { OrganizationRepositoryAPI } from '../../../organizations/repositories/organization-repository-api';
import { OrganizationModelAPI } from '../../../organizations/model/Organization';
import { RefreshSafeBoxesUseCase } from '../refresh-safe-boxes/refresh-safe-boxes-use-case';

export class RefreshAllSafeBoxesUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private refreshSafeBoxesUseCase: RefreshSafeBoxesUseCase
  ) {}

  async execute() {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const listOrganizations = await this.organizationRepositoryAPI.list(
      authorization
    );

    if (
      listOrganizations.status === 200 &&
      listOrganizations.data.status === 'ok'
    ) {
      const organizations = listOrganizations.data
        .msg as OrganizationModelAPI[];

      await Promise.all(
        organizations.map(async (organization) => {
          const response = await this.refreshSafeBoxesUseCase.execute(
            {
              organizationId: organization._id.$oid,
            },
            1
          );

          if (response.message !== 'ok')
            throw new Error('ERRO REFRESH SAFE BOX USE CASE');
        })
      );

      return { message: 'ok' };
    }

    throw new Error(
      'ERROR API LIST MY ORGANIZATIONS -> REFRESH ALL SAFE BOXES '
    );
  }
}
