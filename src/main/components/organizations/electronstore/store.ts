import DBOrganizationIcon from '../../../database/organizationIcons';
import { store } from '../../../main';
import DBOrganization from '../../../database/organizations';

export async function refreshOrganizations() {
  const listOrganizations = await DBOrganization.listOrganizations();

  const sort = listOrganizations.sort((x, y) => {
    const a = x.nome.toUpperCase();
    const b = y.nome.toUpperCase();
    return a == b ? 0 : a > b ? 1 : -1;
  });

  const listOrganizationsIcons =
    await DBOrganizationIcon.listOrganizationsIcons();

  store.set('organizations', sort);

  store.set('iconeAll', listOrganizationsIcons);
}
