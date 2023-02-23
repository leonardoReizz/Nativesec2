import { store } from '@/main/main';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IDeleteSafeBoxRequestDTO } from './delete-safe-box-request-dto';

export class DeleteSafeBoxUseCase {
  constructor(
    private safeBoxRepositoryAPI: SafeBoxRepositoryAPI,
    private safeBoxRepositoryDatabase: SafeBoxRepositoryDatabase
  ) {}

  async execute(data: IDeleteSafeBoxRequestDTO) {
    const apiDelete = await this.safeBoxRepositoryAPI.delete(data);

    if (apiDelete.status !== 200 || apiDelete.data.status !== 'ok') {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error API delete safebox, ${JSON.stringify(apiDelete)}`
      );
    }

    const databaseDelete = await this.safeBoxRepositoryDatabase.delete(
      data.safeBoxId
    );

    if (databaseDelete !== true) {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error DATABASE delete safe box, ${JSON.stringify(apiDelete)}`
      );
    }

    await refreshSafeBoxes(data.organizationId);
    return { message: 'ok' };
  }
}
