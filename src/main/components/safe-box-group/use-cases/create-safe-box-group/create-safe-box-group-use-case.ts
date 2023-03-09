import { store } from '@/main/main';
import { IPCError } from '@/main/utils/IPCError';
import { refreshSafeBoxGroup } from '../../electron-store/store';
import { ISafeBoxGroupModelAPI } from '../../model/safe-box-group';
import { SafeBoxGroupRepositoryAPI } from '../../repositories/safe-box-group-repository-API';
import { SafeBoxGroupRepositoryDatabase } from '../../repositories/safe-box-group-repository-database';
import { ICreateSafeBoxGroupRequestDTO } from './create-safe-box-group-request-dto';

export class CreateSafeBoxGroupUseCase {
  constructor(
    private safeBoxGroupRepositoryAPI: SafeBoxGroupRepositoryAPI,
    private safeBoxGroupRepositoryDatabase: SafeBoxGroupRepositoryDatabase
  ) {}

  async execute(data: ICreateSafeBoxGroupRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const createAPI = await this.safeBoxGroupRepositoryAPI.create(
    { cofres: data.safeBoxes,
    descricao: data.description,
    nome: data.name,
    organizacao: data.organization

  },
      authorization
    );

    IPCError({
      object: createAPI,
      message: 'ERROR API CREATE SAFE BOX GROUP',
      type: 'api',
    });

    const apiCreatedObject: ISafeBoxGroupModelAPI = createAPI.data.detail[0];

    const createDatabase = await this.safeBoxGroupRepositoryDatabase.create(
      {
        ...apiCreatedObject,
        _id: apiCreatedObject._id.$oid,
        data_atualizacao: apiCreatedObject.data_atualizacao.$date,
        data_hora_create: apiCreatedObject.data_hora_create.$date,
        cofres: JSON.stringify(apiCreatedObject.cofres)
      }
    );

    IPCError({
      object: createDatabase,
      message: 'ERROR DATABASE CREATE SAFE BOX GROUP',
      type: 'database',
    });

    await refreshSafeBoxGroup(
      this.safeBoxGroupRepositoryDatabase,
      apiCreatedObject.organizacao
    );

    return { message: 'ok' };
  }
}
