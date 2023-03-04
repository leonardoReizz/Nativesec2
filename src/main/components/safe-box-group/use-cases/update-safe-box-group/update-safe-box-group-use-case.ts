import { store } from '@/main/main';
import { IPCError } from '@/main/utils/IPCError';
import { refreshSafeBoxGroup } from '../../electron-store/store';
import { ISafeBoxGroupModelAPI } from '../../model/safe-box-group';
import { SafeBoxGroupRepositoryAPI } from '../../repositories/safe-box-group-repository-API';
import { SafeBoxGroupRepositoryDatabase } from '../../repositories/safe-box-group-repository-database';
import { UpdateSafeBoxGroupRequestDTO } from './update-safe-box-group-request-dto';

export class UpdateSafeBoxGroupUseCase {
  constructor(
    private safeBoxGroupRepositoryAPI: SafeBoxGroupRepositoryAPI,
    private safeBoxGroupRepositoryDatabase: SafeBoxGroupRepositoryDatabase
  ) {}

  async execute(safeBoxGroup: UpdateSafeBoxGroupRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const updateSafeBoxGroupAPI = await this.safeBoxGroupRepositoryAPI.update(
      {
        id: safeBoxGroup.id,
        nome: safeBoxGroup.name,
        descricao: safeBoxGroup.description,
        cofres: safeBoxGroup.safeboxes,
        organizacao: safeBoxGroup.organization,
      },
      authorization
    );

    IPCError({
      object: updateSafeBoxGroupAPI,
      message: 'ERRO API UPDATE SAFE BOX GROUP',
      type: 'api',
    });

    const updatedSafeBoxGroup: ISafeBoxGroupModelAPI =
      updateSafeBoxGroupAPI?.data?.detail[0];

    if (updatedSafeBoxGroup) {
      const updateSafeBoxGroupDatabase =
        await this.safeBoxGroupRepositoryDatabase.update({
          _id: updatedSafeBoxGroup._id.$oid,
          cofres: JSON.stringify(updatedSafeBoxGroup.cofres),
          data_atualizacao: updatedSafeBoxGroup.data_atualizacao.$date,
          descricao: updatedSafeBoxGroup.descricao,
          nome: updatedSafeBoxGroup.nome,
        });

      IPCError({
        object: updateSafeBoxGroupDatabase,
        message: 'ERROR DATABASE UPDATE SAFE BOX GROUP',
        type: 'database',
      });

      await refreshSafeBoxGroup(
        this.safeBoxGroupRepositoryDatabase,
        safeBoxGroup.organization
      );

      return { message: 'ok' };
    }
    return { message: 'nok' };
  }
}
