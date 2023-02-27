import { IPCError } from '@/main/utils/IPCError';
import { OrganizationIconRepositoryDatabase } from '../../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryDatabase } from '../../../repositories/organization-repository-database';
import {
  OrganizationIconModelAPI,
  OrganizationModelAPI,
  OrganizationModelDatabase,
} from '../../../model/Organization';

interface IOrganizationComparatorData {
  organizationsAPI: OrganizationModelAPI[];
  organizationRepositoryDatabase: OrganizationRepositoryDatabase;
  organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase;
  organizationsDatabase: OrganizationModelDatabase[];
  icons: OrganizationIconModelAPI[];
}

export async function organizationComparator({
  organizationsAPI,
  organizationRepositoryDatabase,
  organizationsDatabase,
  organizationIconRepositoryDatabase,
  icons,
}: IOrganizationComparatorData): Promise<boolean> {
  let comparatorResponse = false;
  let organizationsDatabaseList = [...organizationsDatabase];

  await Promise.all(
    organizationsAPI.map(async (orgAPI) => {
      const filter = organizationsDatabaseList.filter(
        (orgDatabase) => orgDatabase._id === orgAPI._id.$oid
      );

      if (filter.length) {
        if (filter[0].data_atualizacao !== orgAPI.data_atualizacao.$date) {
          comparatorResponse = true;
          const responseOrganization =
            await organizationRepositoryDatabase.update({
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
          const responseIcon = await organizationIconRepositoryDatabase.update({
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
        comparatorResponse = true;
        const responseOrganization =
          await organizationRepositoryDatabase.create({
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

        const responseIcon = await organizationIconRepositoryDatabase.create({
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
    comparatorResponse = true;
    const responseOrganization = await organizationRepositoryDatabase.delete(
      orgDatabase._id
    );

    const responseIcon = await organizationIconRepositoryDatabase.delete(
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

  return comparatorResponse;
}
