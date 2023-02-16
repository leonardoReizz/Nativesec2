import { store } from '@/main/main';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IListSafeBoxRequestDTO } from './IListSafeBoxRequestDTO';

export class ListSafeBoxUseCase {
  constructor(private safeBoxRepositoryDatabase: SafeBoxRepositoryDatabase) {}

  async execute(data: IListSafeBoxRequestDTO) {
    const listDB = await this.safeBoxRepositoryDatabase.list(
      data.organizationId
    );

    if (listDB instanceof Error) {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error DATABASE list safe box, ${JSON.stringify(listDB)}`
      );
    }

    await refreshSafeBoxes(data.organizationId);

    return { message: 'ok' };
  }
}
