import { store } from '../../../../main';
import { IToken } from '../../../../types';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IUpdateUsersSafeBoxRequestDTO } from './update-users-safe-box-request-dto';

export class UpdateUsersSafeBoxUseCase {
  constructor(
    private safeBoxRepositoryAPI: SafeBoxRepositoryAPI,
    private safeBoxRepositoryDatabase: SafeBoxRepositoryDatabase
  ) {}

  async execute(data: IUpdateUsersSafeBoxRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const apiUpdate = await this.safeBoxRepositoryAPI.update(
      { ...data, anexos: JSON.parse(data.anexos) },
      authorization
    );

    if (apiUpdate.status === 200 && apiUpdate.data.status === 'ok') {
      await this.safeBoxRepositoryDatabase.update({
        _id: data.id,
        conteudo: apiUpdate.data.detail[0].conteudo,
        usuarios_escrita: JSON.stringify(
          apiUpdate.data.detail[0].usuarios_escrita
        ),
        usuarios_leitura: JSON.stringify(
          apiUpdate.data.detail[0].usuarios_leitura
        ),
        usuarios_escrita_deletado: JSON.stringify(
          apiUpdate.data.detail[0].usuarios_escrita_deletado
        ),
        usuarios_leitura_deletado: JSON.stringify(
          apiUpdate.data.detail[0].usuarios_leitura_deletado
        ),
        data_atualizacao: apiUpdate.data.detail[0].data_atualizacao.$date,
        anexos: JSON.stringify([]),
        criptografia: apiUpdate.data.detail[0].criptografia,
        descricao: apiUpdate.data.detail[0].descricao,
        nome: apiUpdate.data.detail[0].nome,
        organizacao: apiUpdate.data.detail[0].organizacao,
        tipo: apiUpdate.data.detail[0].tipo,
      });

      await refreshSafeBoxes(data.organizacao);

      return {
        message: 'ok',
        data: {
          safeBoxId: data.id,
        },
      };
    }

    throw new Error('nok');
  }
}
