import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { IUpdateOrganizationRequestDTO } from './update-organization-request-dto';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { refreshOrganizations } from '../../electronstore/store';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { OrganizationModelAPI } from '../../model/Organization';

export class UpdateOrganizationUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
  ) {}

  async execute(data: IUpdateOrganizationRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const update = await this.organizationRepositoryAPI.update(
      {
        id: data.organizationId,
        nome: data.name,
        icone: data.icon,
        tema: data.theme,
        descricao: data.description,
      },
      authorization
    );

    if (update.status !== 200 || update.data.status !== 'ok') {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error api update organization, ${JSON.stringify(update)}`
      );
    }

    const organizationUpdated: OrganizationModelAPI = update.data.detail[0];

    const updateOrganization = await this.organizationRepositoryDatabase.update(
      {
        ...organizationUpdated,
        _id: organizationUpdated._id.$oid,
        data_atualizacao: organizationUpdated.data_atualizacao.$date,
        participantes: JSON.stringify(organizationUpdated.participantes),
        administradores: JSON.stringify(organizationUpdated.administradores),
        convidados_administradores: JSON.stringify(
          organizationUpdated.convidados_administradores
        ),
        convidados_participantes: JSON.stringify(
          organizationUpdated.convidados_participantes
        ),
      }
    );

    const updateIcon = await this.organizationIconRepositoryDatabase.update({
      organizationId: data.organizationId,
      icon: data.icon,
    });

    if (updateIcon !== true && updateOrganization !== true) {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error database update organizations, ${JSON.stringify(
          updateIcon
        )} ${JSON.stringify(updateOrganization)}`
      );
    }

    await refreshOrganizations(
      this.organizationRepositoryDatabase,
      this.organizationIconRepositoryDatabase
    );
    return { message: 'ok' };
  }
}
