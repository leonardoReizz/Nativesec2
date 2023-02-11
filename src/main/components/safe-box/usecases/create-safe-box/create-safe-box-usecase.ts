/* eslint-disable @typescript-eslint/no-use-before-define */
import { store } from '../../../../main';
import { IToken } from '../../../../types';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { CreateSafeBoxRequestDTO } from './create-safe-box-request-dto';
import openpgp from '../../../../crypto/openpgp';
import { refreshSafeBoxes } from '../../electron-store/store';
import { KeyRepositoryAPI } from '../../../keys/repositories/key-repository-api';

export class CreateSafeBoxUseCase {
  constructor(
    private safeBoxRepositoryAPI: SafeBoxRepositoryAPI,
    private keyRepositoryAPI: KeyRepositoryAPI,
    private safeBoxRepositoryDatabase: SafeBoxRepositoryDatabase
  ) {}

  async execute(data: CreateSafeBoxRequestDTO) {
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
          return undefined;
        }
      })
    ).then((result) => {
      return result;
    });

    await Promise.all(
      data.conteudo.map(async (item: any) => {
        if (!item.crypto) {
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

    const apiCreate = await this.safeBoxRepositoryAPI.create(
      {
        ...data,
        conteudo: JSON.stringify(content),
        anexos: [],
      },
      authorization
    );

    if (apiCreate.status === 200 && apiCreate.data.status === 'ok') {
      this.safeBoxRepositoryDatabase.create({
        ...data,
        _id: apiCreate.data?.detail[0]._id.$oid,
        conteudo: JSON.stringify(content),
        data_hora_create: apiCreate.data.detail[0].data_hora_create.$date,
        data_atualizacao: apiCreate.data.detail[0].data_atualizacao.$date,
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

      return {
        message: 'ok',
        data: {
          safeBoxId: apiCreate.data?.detail[0]._id.$oid,
        },
      };
    }

    throw new Error('nok');
  }
}
