import { store } from '@/main/main';
import { OrganizationIconRepositoryDatabase } from '../../../repositories/organization-icon-database-repository';
import { OrganizationRepositoryDatabase } from '../../../repositories/organization-repository-database';
import {
  OrganizationIconModelAPI,
  OrganizationModelAPI,
  OrganizationModelDatabase,
} from '../../../model/Organization';

interface IOrganizationComparatorData {
  organizations: OrganizationModelAPI[];
  organizationRepositoryDatabase: OrganizationRepositoryDatabase;
  organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase;
  icons: OrganizationIconModelAPI[];
}

export async function organizationComparator({
  organizations,
  organizationRepositoryDatabase,
  organizationIconRepositoryDatabase,
  icons,
}: IOrganizationComparatorData): Promise<boolean> {
  const queryOrganizations = await organizationRepositoryDatabase.list();

  if (queryOrganizations instanceof Error) {
    throw new Error(
      `${
        (store.get('user') as any)?.email
      }: Error DATABASE list organizations, ${JSON.stringify(
        queryOrganizations
      )}`
    );
  }

  const qOrgFilter = queryOrganizations.filter((qOrg) => qOrg !== undefined);

  if (qOrgFilter.length === 0 && organizations.length > 0) {
    await Promise.all(
      organizations.map(async (item) => {
        await organizationRepositoryDatabase.create({
          _id: item._id.$oid,
          nome: item.nome,
          descricao: item.descricao,
          dono: item.dono,
          data_atualizacao: item.data_atualizacao.$date,
          data_criacao: item.data_criacao.$date,
          limite_usuarios: item.limite_usuarios,
          limite_armazenamento: item.limite_armazenamento,
          convidados_administradores: JSON.stringify(
            item.convidados_administradores
          ),
          convidados_participantes: JSON.stringify(
            item.convidados_participantes
          ),
          participantes: JSON.stringify(item.participantes),
          administradores: JSON.stringify(item.administradores),
          deletado: item.deletado,
          tema: item.tema,
        });

        const filterIcons = icons.filter(
          (icon) => icon._id.$oid === item._id.$oid
        );
        await organizationIconRepositoryDatabase.create({
          icon: filterIcons[0].icone,
          organizationId: filterIcons[0]._id.$oid,
        });
      })
    );
    return true;
  }
  if (organizations.length > qOrgFilter.length) {
    const arrayInsert: OrganizationModelAPI[] = [];
    for (let i = 0; i < organizations.length; i++) {
      let equal = false;
      for (let x = 0; x < qOrgFilter.length; x++) {
        if (qOrgFilter[x]._id === organizations[i]._id.$oid) {
          equal = true;
        }
      }
      if (equal === false) {
        arrayInsert.push(organizations[i]);
      }
    }

    if (arrayInsert.length > 0) {
      await Promise.all(
        arrayInsert.map(async (item) => {
          await organizationRepositoryDatabase.create({
            _id: item._id.$oid,
            nome: item.nome,
            descricao: item.descricao,
            dono: item.dono,
            data_atualizacao: item.data_atualizacao.$date,
            data_criacao: item.data_criacao.$date,
            limite_usuarios: item.limite_usuarios,
            limite_armazenamento: item.limite_armazenamento,
            convidados_administradores: JSON.stringify(
              item.convidados_administradores
            ),
            convidados_participantes: JSON.stringify(
              item.convidados_participantes
            ),
            participantes: JSON.stringify(item.participantes),
            administradores: JSON.stringify(item.administradores),
            deletado: item.deletado,
            tema: item.tema,
          });

          const filterIcons = icons.filter(
            (icon) => icon._id.$oid === item._id.$oid
          );
          await organizationIconRepositoryDatabase.create({
            icon: filterIcons[0].icone,
            organizationId: filterIcons[0]._id.$oid,
          });
        })
      );
    }
    return true;
  }

  if (organizations.length < qOrgFilter.length) {
    const arrayDelete: OrganizationModelDatabase[] = [];
    for (let i = 0; i < qOrgFilter.length; i++) {
      let equal = false;
      for (let x = 0; x < organizations.length; x++) {
        if (qOrgFilter[i]._id === organizations[x]._id.$oid) {
          equal = true;
        }
      }
      if (equal === false) {
        arrayDelete.push(qOrgFilter[i]);
      }
    }
    if (arrayDelete.length > 0) {
      await Promise.all(
        arrayDelete.map(async (item) => {
          organizationRepositoryDatabase.delete(item._id);
          organizationIconRepositoryDatabase.delete(item._id);
        })
      );
    }
    return true;
  }

  if (organizations.length > 0) {
    const arrayUpdate: OrganizationModelAPI[] = [];
    for (let i = 0; i < organizations.length; i++) {
      let equal = false;
      for (let x = 0; x < qOrgFilter.length; x++) {
        if (qOrgFilter[x]._id === organizations[i]._id.$oid) {
          if (
            Number(organizations[i].data_atualizacao.$date) ===
            Number(qOrgFilter[x].data_atualizacao)
          ) {
            equal = true;
          }
        }
      }
      if (equal === false) {
        arrayUpdate.push(organizations[i]);
      }
    }
    if (arrayUpdate.length > 0) {
      await Promise.all(
        arrayUpdate.map(async (item) => {
          await organizationRepositoryDatabase.update({
            _id: item._id.$oid,
            nome: item.nome,
            tema: item.tema,
            dono: item.dono,
            descricao: item.descricao,
            data_atualizacao: item.data_atualizacao.$date,
            convidados_participantes: JSON.stringify(
              item.convidados_participantes
            ),
            convidados_administradores: JSON.stringify(
              item.convidados_administradores
            ),
            participantes: JSON.stringify(item.participantes),
            administradores: JSON.stringify(item.administradores),
            limite_usuarios: item.limite_usuarios,
            limite_armazenamento: item.limite_armazenamento,
            deletado: item.deletado,
          });

          const filterIcons = icons.filter(
            (icon) => icon._id.$oid === item._id.$oid
          );
          await organizationIconRepositoryDatabase.update({
            icon: filterIcons[0].icone,
            organizationId: filterIcons[0]._id.$oid,
          });
        })
      );
      return true;
    }
    return false;
  }
  return false;
}
