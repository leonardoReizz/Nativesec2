import DBOrganization from 'main/database/organizations';
import { store } from 'main/main';

export async function storeUpdateOrganizations() {
  const listOrganizations = await DBOrganization.listOrganizations();
  store.set('organizations', listOrganizations);
}
