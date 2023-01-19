import DBOrganizationIcon from '../../../database/organizationIcons';
import { store } from '../../../main';
import DBOrganization from '../../../database/organizations';

export async function refreshOrganizations() {
  const listOrganizations = await DBOrganization.listOrganizations();
  store.set('organizations', listOrganizations);

  const listOrganizationsIcons =
    await DBOrganizationIcon.listOrganizationsIcons(listOrganizations);

  store.set('organizations', listOrganizations);
  store.set('iconeAll', listOrganizationsIcons);
}
