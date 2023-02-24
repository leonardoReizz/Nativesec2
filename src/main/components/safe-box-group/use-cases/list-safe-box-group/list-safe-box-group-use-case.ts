import { store } from '@/main/main';
import { IPCError } from '@/main/utils/IPCError';
import { SafeBoxGroupRepositoryDatabase } from '../../repositories/safe-box-group-repository-database';
import { ListSafeBoxGroupRequestDTO } from './list-safe-box-group-request-dto';

export class ListSafeBoxGroupUseCase {
  constructor(
    private safeBoxGroupRepositoryDatabase: SafeBoxGroupRepositoryDatabase
  ) {}

  async execute(data: ListSafeBoxGroupRequestDTO) {
    const listSafeBoxGroupDatabase =
      await this.safeBoxGroupRepositoryDatabase.listByOrganizationId(
        data.organizationId
      );

    IPCError({
      object: listSafeBoxGroupDatabase,
      message: 'ERRO API LIST SAFE BOX GROUP',
    });

    store.set('safeboxGroup', listSafeBoxGroupDatabase);

    return {
      message: 'ok',
    };
  }
}
