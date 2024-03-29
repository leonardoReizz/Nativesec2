import { IToken } from '../../../../types';
import { store } from '../../../../main';
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

    if (update.status === 200 && update.data.status === 'ok') {
      const organizationUpdated: OrganizationModelAPI = update.data.detail[0];

      const updateOrganization =
        await this.organizationRepositoryDatabase.update({
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
        });

      const updateIcon = await this.organizationIconRepositoryDatabase.update(
        data.organizationId,
        data.icon
      );

      if (updateIcon !== true && updateOrganization !== true) {
        throw new Error('Error update organization icon in database');
      }
      await refreshOrganizations();
      return { message: 'ok' };
    }
    throw new Error('Erro api update organization');
  }
}
