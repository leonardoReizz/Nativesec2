import DBSafeBox from '../../../database/safebox';
import { store } from '../../../main';

export async function refreshSafeBoxes(organizationId: string) {
  const listSafeBox = await DBSafeBox.listSafeBox({
    organizationId,
  });

  store.set('safebox', listSafeBox);
}
