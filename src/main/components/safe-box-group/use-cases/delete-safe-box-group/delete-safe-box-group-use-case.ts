import { store } from '@/main/main';
import { IPCError } from '@/main/utils/IPCError';
import { refreshSafeBoxGroup } from '../../electron-store/store';
import { SafeBoxGroupRepositoryAPI } from '../../repositories/safe-box-group-repository-API';
import { SafeBoxGroupRepositoryDatabase } from '../../repositories/safe-box-group-repository-database';
import { IDeleteSafeBoxGroupRequestDTO } from './delete-safe-box-group-request-dto';

export class DeleteSafeBoxGroupUseCase {
  constructor(
    private safeBoxGroupRepositoryAPI: SafeBoxGroupRepositoryAPI,
    private safeBoxGroupRepositoryDatabase: SafeBoxGroupRepositoryDatabase
  ) {}

  async execute(data: IDeleteSafeBoxGroupRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const deleteAPI = await this.safeBoxGroupRepositoryAPI.delete(
      data,
      authorization
    );

    IPCError({
      object: deleteAPI,
      message: 'ERROR API DELETE SAFE BOX GROUP',
      type: 'api',
    });

    const deleteDatabase = await this.safeBoxGroupRepositoryDatabase.deleteById(
      data.safeBoxGroupId
    );

    IPCError({
      object: deleteDatabase,
      message: 'ERROR DATABASE DELETE SAFE BOX GROUP',
      type: 'database',
    });

    await refreshSafeBoxGroup(
      this.safeBoxGroupRepositoryDatabase,
      data.organizationId
    );

    return { message: 'ok' };
  }
}
