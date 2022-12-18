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
    if (!data.organizationId) throw new Error('Invalid organizationId');
    if (!data.safeBoxId) throw new Error('Invalid safeBoxId');

    const apiDelete = await this.safeBoxRepositoryAPI.delete(data);

    if (apiDelete.status === 200 && apiDelete.data.status === 'ok') {
      const databaseDelete = await this.safeBoxRepositoryDatabase.delete(
        data.safeBoxId
      );

      if (databaseDelete === true) {
        await refreshSafeBoxes(data.organizationId);
        return { message: 'ok' };
      }
      throw new Error('Error Delete Safe Box in Database');
    }
    throw new Error('Error Delete Safe Box in API');
  }
}
