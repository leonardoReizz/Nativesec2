import { store } from '@/main/main';
import { IPCError } from '@/main/utils/IPCError';
import { ISafeBoxGroupModelDatabase } from '../model/safe-box-group';
import { SafeBoxGroupRepositoryDatabase } from '../repositories/safe-box-group-repository-database';

export async function refreshSafeBoxGroup(
  safeBoxGroupRepositoryDatabase: SafeBoxGroupRepositoryDatabase,
  organizationId: string
) {
  const select = await safeBoxGroupRepositoryDatabase.listByOrganizationId(
    organizationId
  );

  IPCError({
    object: select,
    message: 'ERROR DATABASE REFRESH SAFE BOX GROUP',
    type: 'database',
  });

  const sort = (<ISafeBoxGroupModelDatabase[]>select).sort((x, y) => {
    const a = x.nome.toUpperCase();
    const b = y.nome.toUpperCase();
    return a == b ? 0 : a > b ? 1 : -1;
  });

  store.set('safeBoxGroup', sort);
}
