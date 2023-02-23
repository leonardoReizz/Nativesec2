import { store } from '../../../main';
import { OrganizationIconRepositoryDatabase } from '../repositories/organization-icon-database-repository';
import { OrganizationRepositoryDatabase } from '../repositories/organization-repository-database';

export async function refreshOrganizations(
  organizationRepositoryDatabase: OrganizationRepositoryDatabase,
  organizationIconRepositoryDatabase: OrganizationIconRepositoryDatabase
) {
  const listOrganizations = await organizationRepositoryDatabase.list();

  if (listOrganizations && !(listOrganizations instanceof Error)) {
    const sort = listOrganizations.sort((x, y) => {
      const a = x.nome.toUpperCase();
      const b = y.nome.toUpperCase();
      return a == b ? 0 : a > b ? 1 : -1;
    });
    const listOrganizationsIcons =
      await organizationIconRepositoryDatabase.list();

    store.set('iconeAll', listOrganizationsIcons);
    store.set('organizations', sort);
  }
}
