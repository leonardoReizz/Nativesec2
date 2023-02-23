import { OrganizationModelAPI } from '@/main/components/organizations/model/Organization';
import { OrganizationRepositoryAPI } from '@/main/components/organizations/repositories/organization-repository-api';
import { store } from '@/main/main';
import { IToken } from '@/main/types';
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
      listOrganizations.status !== 200 ||
      listOrganizations.data.status !== 'ok'
    ) {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error API list my organizations -> refresh all safe boxes, ${JSON.stringify(
          listOrganizations
        )}`
      );
    }

    const organizations = listOrganizations.data.msg as OrganizationModelAPI[];

    await Promise.all(
      organizations.map(async (organization) => {
        const response = await this.refreshSafeBoxesUseCase.execute(
          {
            organizationId: organization._id.$oid,
          },
          1
        );

        if (response.message !== 'ok')
          throw new Error(
            `${
              (store.get('user') as any)?.email
            }: Error refresh safe box use case , ${JSON.stringify(response)}`
          );
      })
    );

    return { message: 'ok' };
  }
}
