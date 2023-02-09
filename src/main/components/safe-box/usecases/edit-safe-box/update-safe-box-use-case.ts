import { store } from '../../../../main';
import { IToken } from '../../../../types';
import openpgp from '../../../../crypto/openpgp';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IUpdateSafeBoxRequestDTO } from './update-safe-box-request-dto';
import { KeyRepositoryAPI } from '../../../keys/repositories/key-repository-api';
import { SafeBoxAPIModel } from '../../model/SafeBox';

export class UpdateSafeBoxUseCase {
  constructor(
    private safeBoxRepositoryAPI: SafeBoxRepositoryAPI,
    private keyRepositoryAPI: KeyRepositoryAPI,
    private safeBoxRepositoryDatabase: SafeBoxRepositoryDatabase
  ) {}

  async execute(data: IUpdateSafeBoxRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const users = [...data.usuarios_escrita, ...data.usuarios_leitura];
    let content = {};

    const pubKeys = await Promise.all(
      users.map(async (email): Promise<string[] | unknown> => {
        try {
          const apiGetPubKey = await this.keyRepositoryAPI.getPublicKey(
            email,
            authorization
          );
          if (
            apiGetPubKey.status === 200 &&
            apiGetPubKey.data?.status === 'ok'
          ) {
            return apiGetPubKey.data.msg[0].chave as string;
          }
          return undefined;
        } catch (error) {
          console.log(error);
          throw new Error(
            `Error api get public key in update safe box ${error}`
          );
        }
      })
    ).then((result) => {
      return result;
    });

    await Promise.all(
      data.conteudo.map(async (item: any) => {
        if (item.crypto === false) {
          content = {
            ...content,
            [`${item.name}`]: item[`${item.name}`],
          };
        } else {
          const encrypted = await openpgp.encrypt({
            message: item[`${item.name}`],
            publicKeysArmored: pubKeys as string[],
          });

          content = {
            ...content,
            [`${item.name}`]: encrypted.encryptedMessage,
          };
        }
      })
    ).then(() => {
      return content;
    });

    const apiUpdate = await this.safeBoxRepositoryAPI.update(
      { ...data, conteudo: JSON.stringify(content) },
      authorization
    );

    if (apiUpdate.status === 200 && apiUpdate.data.status === 'ok') {
      const updatedSafeBox: SafeBoxAPIModel = apiUpdate.data.detail[0];
      const updateDatabase = await this.safeBoxRepositoryDatabase.update({
        _id: updatedSafeBox._id.$oid,
        conteudo: updatedSafeBox.conteudo,
        usuarios_escrita: JSON.stringify(updatedSafeBox.usuarios_escrita),
        usuarios_leitura: JSON.stringify(updatedSafeBox.usuarios_leitura),
        usuarios_escrita_deletado: JSON.stringify(
          updatedSafeBox.usuarios_escrita_deletado
        ),
        usuarios_leitura_deletado: JSON.stringify(
          updatedSafeBox.usuarios_leitura_deletado
        ),
        data_atualizacao: updatedSafeBox.data_atualizacao.$date,
        anexos: JSON.stringify(updatedSafeBox.anexos),
        criptografia: updatedSafeBox.criptografia,
        descricao: updatedSafeBox.descricao,
        nome: updatedSafeBox.nome,
        organizacao: updatedSafeBox.organizacao,
        tipo: updatedSafeBox.tipo,
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
