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

  organizationsAPI.map(async (orgAPI) => {
    const filter = organizationsDatabaseList.filter(
      (orgDatabase) => orgDatabase._id === orgAPI._id.$oid
    );

    if (filter[0]) {
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
      const responseOrganization = await organizationRepositoryDatabase.create({
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
  });

  console.log('finalizei update e create');

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
      message: 'ERROR DATABASE DELETE ORGANIZATIONC ICON',
    });
  });

  return comparatorResponse;

  // (<OrganizationModelDatabase[]>organizationsDatabase)
  // .map((orgDatabase) => {
  //   const filter = organizationsAPI.filter(
  //     (orgAPI) => orgAPI._id.$oid === orgDatabase._id
  //   );

  //   if (filter[0]) {
  //     // update
  //   } else {
  //     // create
  //   }

  //   organizationsDatabaseList = organizationsDatabaseList.filter(
  //     (orgDatabase) => orgDatabase._id !== filter[0]
  //   );
  // });

  // if (organizationsDatabase instanceof Error) {
  //   throw new Error(
  //     `${
  //       (store.get('user') as any)?.email
  //     }: Error DATABASE list organizations, ${JSON.stringify(
  //       organizationsDatabase
  //     )}`
  //   );
  // }

  // const qOrgFilter = organizationsDatabase.filter((qOrg) => qOrg !== undefined);

  // if (qOrgFilter.length === 0 && organizationsAPI.length > 0) {
  //   await Promise.all(
  //     organizationsAPI.map(async (item) => {
  //       await organizationRepositoryDatabase.create({
  //         _id: item._id.$oid,
  //         nome: item.nome,
  //         descricao: item.descricao,
  //         dono: item.dono,
  //         data_atualizacao: item.data_atualizacao.$date,
  //         data_criacao: item.data_criacao.$date,
  //         limite_usuarios: item.limite_usuarios,
  //         limite_armazenamento: item.limite_armazenamento,
  //         convidados_administradores: JSON.stringify(
  //           item.convidados_administradores
  //         ),
  //         convidados_participantes: JSON.stringify(
  //           item.convidados_participantes
  //         ),
  //         participantes: JSON.stringify(item.participantes),
  //         administradores: JSON.stringify(item.administradores),
  //         deletado: item.deletado,
  //         tema: item.tema,
  //       });

  //       const filterIcons = icons.filter(
  //         (icon) => icon._id.$oid === item._id.$oid
  //       );
  //       await organizationIconRepositoryDatabase.create({
  //         icon: filterIcons[0].icone,
  //         organizationId: filterIcons[0]._id.$oid,
  //       });
  //     })
  //   );
  //   return true;
  // }
  // if (organizationsAPI.length > qOrgFilter.length) {
  //   const arrayInsert: OrganizationModelAPI[] = [];
  //   for (let i = 0; i < organizationsAPI.length; i++) {
  //     let equal = false;
  //     for (let x = 0; x < qOrgFilter.length; x++) {
  //       if (qOrgFilter[x]._id === organizationsAPI[i]._id.$oid) {
  //         equal = true;
  //       }
  //     }
  //     if (equal === false) {
  //       arrayInsert.push(organizationsAPI[i]);
  //     }
  //   }

  //   if (arrayInsert.length > 0) {
  //     await Promise.all(
  //       arrayInsert.map(async (item) => {
  //         await organizationRepositoryDatabase.create({
  //           _id: item._id.$oid,
  //           nome: item.nome,
  //           descricao: item.descricao,
  //           dono: item.dono,
  //           data_atualizacao: item.data_atualizacao.$date,
  //           data_criacao: item.data_criacao.$date,
  //           limite_usuarios: item.limite_usuarios,
  //           limite_armazenamento: item.limite_armazenamento,
  //           convidados_administradores: JSON.stringify(
  //             item.convidados_administradores
  //           ),
  //           convidados_participantes: JSON.stringify(
  //             item.convidados_participantes
  //           ),
  //           participantes: JSON.stringify(item.participantes),
  //           administradores: JSON.stringify(item.administradores),
  //           deletado: item.deletado,
  //           tema: item.tema,
  //         });

  //         const filterIcons = icons.filter(
  //           (icon) => icon._id.$oid === item._id.$oid
  //         );
  //         await organizationIconRepositoryDatabase.create({
  //           icon: filterIcons[0].icone,
  //           organizationId: filterIcons[0]._id.$oid,
  //         });
  //       })
  //     );
  //   }
  //   return true;
  // }

  // if (organizationsAPI.length < qOrgFilter.length) {
  //   const arrayDelete: OrganizationModelDatabase[] = [];
  //   for (let i = 0; i < qOrgFilter.length; i++) {
  //     let equal = false;
  //     for (let x = 0; x < organizationsAPI.length; x++) {
  //       if (qOrgFilter[i]._id === organizationsAPI[x]._id.$oid) {
  //         equal = true;
  //       }
  //     }
  //     if (equal === false) {
  //       arrayDelete.push(qOrgFilter[i]);
  //     }
  //   }
  //   if (arrayDelete.length > 0) {
  //     await Promise.all(
  //       arrayDelete.map(async (item) => {
  //         organizationRepositoryDatabase.delete(item._id);
  //         organizationIconRepositoryDatabase.delete(item._id);
  //       })
  //     );
  //   }
  //   return true;
  // }

  // if (organizationsAPI.length > 0) {
  //   const arrayUpdate: OrganizationModelAPI[] = [];
  //   for (let i = 0; i < organizationsAPI.length; i++) {
  //     let equal = false;
  //     for (let x = 0; x < qOrgFilter.length; x++) {
  //       if (qOrgFilter[x]._id === organizationsAPI[i]._id.$oid) {
  //         if (
  //           Number(organizationsAPI[i].data_atualizacao.$date) ===
  //           Number(qOrgFilter[x].data_atualizacao)
  //         ) {
  //           equal = true;
  //         }
  //       }
  //     }
  //     if (equal === false) {
  //       arrayUpdate.push(organizationsAPI[i]);
  //     }
  //   }
  //   if (arrayUpdate.length > 0) {
  //     await Promise.all(
  //       arrayUpdate.map(async (item) => {
  //         await organizationRepositoryDatabase.update({
  //           _id: item._id.$oid,
  //           nome: item.nome,
  //           tema: item.tema,
  //           dono: item.dono,
  //           descricao: item.descricao,
  //           data_atualizacao: item.data_atualizacao.$date,
  //           convidados_participantes: JSON.stringify(
  //             item.convidados_participantes
  //           ),
  //           convidados_administradores: JSON.stringify(
  //             item.convidados_administradores
  //           ),
  //           participantes: JSON.stringify(item.participantes),
  //           administradores: JSON.stringify(item.administradores),
  //           limite_usuarios: item.limite_usuarios,
  //           limite_armazenamento: item.limite_armazenamento,
  //           deletado: item.deletado,
  //         });

  //         const filterIcons = icons.filter(
  //           (icon) => icon._id.$oid === item._id.$oid
  //         );
  //         await organizationIconRepositoryDatabase.update({
  //           icon: filterIcons[0].icone,
  //           organizationId: filterIcons[0]._id.$oid,
  //         });
  //       })
  //     );
  //     return true;
  //   }
  //   return false;
  // }
  // return false;
}
