import { refreshSafeBoxGroup } from '@/main/components/safe-box-group/electron-store/store';
import { SafeBoxGroupRepositoryDatabase } from '@/main/components/safe-box-group/repositories/safe-box-group-repository-database';
import { RefreshAllSafeBoxGroupUseCase } from '@/main/components/safe-box-group/use-cases/refresh-all-safe-box-group/refresh-all-safe-box-group-use-case';
import { store } from '@/main/main';
import { IPCError } from '@/main/utils/IPCError';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IDeleteSafeBoxRequestDTO } from './delete-safe-box-request-dto';

export class DeleteSafeBoxUseCase {
  constructor(
    private safeBoxRepositoryAPI: SafeBoxRepositoryAPI,
    private safeBoxRepositoryDatabase: SafeBoxRepositoryDatabase,
    private safeBoxGroupRepositoryDatabase: SafeBoxGroupRepositoryDatabase,
    private refreshAllSafeBoxGroupUseCase: RefreshAllSafeBoxGroupUseCase
  ) {}

  async execute(data: IDeleteSafeBoxRequestDTO) {
    const apiDelete = await this.safeBoxRepositoryAPI.delete(data);

    IPCError({
      object: apiDelete,
      message: 'ERROR API DELETE SAFE BOX',
      type: 'api',
    });

    const databaseDelete = await this.safeBoxRepositoryDatabase.delete(
      data.safeBoxId
    );

    IPCError({
      object: databaseDelete,
      message: 'ERROR DATABASE DELETE SAFE BOX',
      type: 'database',
    });

    await refreshSafeBoxes(data.organizationId);

    await this.refreshAllSafeBoxGroupUseCase.execute();

    await refreshSafeBoxGroup(
      this.safeBoxGroupRepositoryDatabase,
      data.organizationId
    );

    console.log(store.get('safeBoxGroup'));

    return { message: 'ok' };
  }
}
