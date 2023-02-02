import { store } from '../../../../main';
import { IToken } from '../../../../types';
import openpgp from '../../../../crypto/openpgp';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IUpdateSafeBoxRequestDTO } from './update-safe-box-request-dto';
import { KeyRepositoryAPI } from '../../../keys/repositories/key-repository-api';

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

    console.log('rodei as chaves publicas');
    console.log(data.conteudo);

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

    console.log('encriptei');
    console.log(content);
    const apiUpdate = await this.safeBoxRepositoryAPI.update(
      { ...data, conteudo: JSON.stringify(content) },
      authorization
    );

    console.log('apiUpdate');
    console.log(apiUpdate);

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
        data_atualizacao: apiUpdate.data.data_atualizacao.$date,
        anexos: JSON.stringify([]),
      });
      await refreshSafeBoxes(data.organizacao);

      return { message: 'ok' };
    }

    throw new Error('nok');
  }
}
