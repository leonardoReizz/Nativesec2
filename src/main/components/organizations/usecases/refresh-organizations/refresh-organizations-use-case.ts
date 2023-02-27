import { store } from '@/main/main';
import { IPCError } from '@/main/utils/IPCError';
import { refreshOrganizations } from '../../electronstore/store';
import {
  OrganizationIconModelAPI,
  OrganizationModelAPI,
  OrganizationModelDatabase,
} from '../../model/Organization';
import { OrganizationIconRepositoryDatabase } from '../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryAPI } from '../../repositories/organization-repository-api';
import { OrganizationRepositoryDatabase } from '../../repositories/organization-repository-database';
import { organizationComparator } from './comparators/organizationComparator';

export class RefreshOrganizationsUseCase {
  constructor(
    private organizationRepositoryAPI: OrganizationRepositoryAPI,
    private organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase,
    private organizationRepositoryDatabase: OrganizationRepositoryDatabase
  ) {}

  async execute() {
    let organizationsResponse = false;

    const { tokenType, accessToken } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const listAPI = await this.organizationRepositoryAPI.list(authorization);

    IPCError({
      object: listAPI,
      message: 'ERROR API LIST ORGANIZATIONS',
      type: 'api',
    });

    const apiOrganizations: OrganizationModelAPI[] = listAPI.data.msg;

    const organizationInfo: OrganizationModelAPI[] = await Promise.all(
      apiOrganizations.map(async (org: OrganizationModelAPI) => {
        const APIGetOrganization =
          await this.organizationRepositoryAPI.getOrganization(
            org._id.$oid,
            authorization
          );

        IPCError({
          object: APIGetOrganization,
          message: 'ERROR API GET ORGANIZATION INFO',
          type: 'api',
        });

        return APIGetOrganization?.data?.msg[0];
      })
    );

    const APIListOrganizationIcons =
      await this.organizationRepositoryAPI.listIcons(authorization);

    IPCError({
      object: APIListOrganizationIcons,
      message: 'ERROR API GET LIST ORGANIZATION ICONS',
      type: 'api',
    });

    organizationsResponse = true;

    let organizationsDatabaseList =
      (await this.organizationRepositoryDatabase.list()) as unknown as OrganizationModelDatabase[];

    IPCError({
      object: organizationsDatabaseList,
      message: 'ERROR DATABASE LIST ORGANIZATIONS',
      type: 'database',
    });

    const icons = APIListOrganizationIcons.data
      .msg as OrganizationIconModelAPI[];

    // organizationsResponse = await organizationComparator({
    //   organizationsAPI: organizationInfo,
    //   organizationsDatabase,
    //   organizationRepositoryDatabase: this.organizationRepositoryDatabase,
    //   icons: APIListOrganizationIcons.data.msg,
    //   organizationIconRepositoryDatabase:
    //     this.organizationIconRepositoryDatabase,
    // });

    await Promise.all(
      organizationInfo.map(async (orgAPI) => {
        const filter = organizationsDatabaseList.filter(
          (orgDatabase) => orgDatabase._id === orgAPI._id.$oid
        );

        if (filter.length) {
          if (filter[0].data_atualizacao !== orgAPI.data_atualizacao.$date) {
            organizationsResponse = true;
            const responseOrganization =
              await this.organizationRepositoryDatabase.update({
                ...orgAPI,
                _id: orgAPI._id.$oid,
                data_atualizacao: orgAPI.data_atualizacao.$date,
                convidados_participantes: JSON.stringify(
                  orgAPI.convidados_participantes
                ),
                convidados_administradores: JSON.stringify(
                  orgAPI.convidados_administradores
                ),
                participantes: JSON.stringify(orgAPI.participantes),
                administradores: JSON.stringify(orgAPI.administradores),
              });

            const filterIcons = icons.filter(
              (icon) => icon._id.$oid === orgAPI._id.$oid
            );
            const responseIcon =
              await this.organizationIconRepositoryDatabase.update({
                icon: filterIcons[0].icone,
                organizationId: filterIcons[0]._id.$oid,
              });

            IPCError({
              object: responseOrganization,
              type: 'database',
              message: 'ERROR DATABASE UPDATE ORGANIZATION',
            });

            IPCError({
              object: responseIcon,
              type: 'database',
              message: 'ERROR DATABASE UPDATE ORGANIZATION ICON',
            });
          }
        } else {
          organizationsResponse = true;
          const responseOrganization =
            await this.organizationRepositoryDatabase.create({
              ...orgAPI,
              _id: orgAPI._id.$oid,
              data_atualizacao: orgAPI.data_atualizacao.$date,
              data_criacao: orgAPI.data_criacao.$date,
              convidados_administradores: JSON.stringify(
                orgAPI.convidados_administradores
              ),
              convidados_participantes: JSON.stringify(
                orgAPI.convidados_participantes
              ),
              participantes: JSON.stringify(orgAPI.participantes),
              administradores: JSON.stringify(orgAPI.administradores),
            });

          const filterIcons = icons.filter(
            (icon) => icon._id.$oid === orgAPI._id.$oid
          );

          const responseIcon =
            await this.organizationIconRepositoryDatabase.create({
              icon: filterIcons[0].icone,
              organizationId: filterIcons[0]._id.$oid,
            });

          IPCError({
            object: responseOrganization,
            type: 'database',
            message: 'ERROR DATABASE CREATE ORGANIZATION',
          });

          IPCError({
            object: responseIcon,
            type: 'database',
            message: 'ERROR DATABASE CREATE ORGANIZATION ICON',
          });
        }

        organizationsDatabaseList = organizationsDatabaseList.filter(
          (orgDatabase) => orgDatabase._id !== orgAPI._id.$oid
        );
      })
    );

    organizationsDatabaseList.map(async (orgDatabase) => {
      organizationsResponse = true;
      const responseOrganization =
        await this.organizationRepositoryDatabase.delete(orgDatabase._id);

      const responseIcon = await this.organizationIconRepositoryDatabase.delete(
        orgDatabase._id
      );

      IPCError({
        object: responseOrganization,
        type: 'database',
        message: 'ERROR DATABASE DELETE ORGANIZATION',
      });

      IPCError({
        object: responseIcon,
        type: 'database',
        message: 'ERROR DATABASE DELETE ORGANIZATION ICON',
      });
    });

    await refreshOrganizations(
      this.organizationRepositoryDatabase,
      this.organizationIconRepositoryDatabase
    );

    return {
      message: 'ok',
      data: {
        organizationsResponse,
      },
    };
  }
}
