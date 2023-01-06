import { store } from '../../../../main';
import { IToken } from '../../../../types';
import openpgp from '../../../../crypto/openpgp';
import apiPubKey from '../../../../API/publicKey/index';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IUpdateSafeBoxRequestDTO } from './update-safe-box-request-dto';

export class UpdateSafeBoxUseCase {
  constructor(
    private safeBoxRepositoryAPI: SafeBoxRepositoryAPI,
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
          const apiGetPubKey = await apiPubKey.getPublicKey({
            email,
            authorization: `${tokenType} ${accessToken}`,
          });
          if (
            apiGetPubKey.status === 200 &&
            apiGetPubKey.data?.status === 'ok'
          ) {
            return apiGetPubKey.data.msg[0].chave as string;
          }
          return undefined;
        } catch (error) {
          console.log(error);
          return undefined;
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
      this.safeBoxRepositoryDatabase.update({
        ...data,
        _id: data.id,
        conteudo: JSON.stringify(content),
        usuarios_escrita: JSON.stringify(data.usuarios_escrita),
        usuarios_leitura: JSON.stringify(data.usuarios_leitura),
        usuarios_escrita_deletado: JSON.stringify(
          data.usuarios_escrita_deletado
        ),
        usuarios_leitura_deletado: JSON.stringify(
          data.usuarios_leitura_deletado
        ),
        anexos: JSON.stringify([]),
      });
      await refreshSafeBoxes(data.organizacao);

      return { message: 'ok' };
    }

    throw new Error('nok');
  }
}
