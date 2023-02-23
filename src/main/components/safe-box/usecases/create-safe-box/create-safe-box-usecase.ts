/* eslint-disable @typescript-eslint/no-use-before-define */

import { KeyRepositoryAPI } from '@/main/components/keys/repositories/key-repository-api';
import openpgp from '@/main/crypto/openpgp';
import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { CreateSafeBoxRequestDTO } from './create-safe-box-request-dto';

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
            apiGetPubKey.status !== 200 ||
            apiGetPubKey.data.status !== 'ok'
          ) {
            throw new Error(
              `${
                (store.get('user') as any)?.email
              }: Error API get public key, ${JSON.stringify(apiGetPubKey)}`
            );
          }
          return apiGetPubKey.data.msg[0].chave as string;
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

    if (apiCreate.status !== 200 || apiCreate.data.status !== 'ok') {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error API create safe box, ${JSON.stringify(apiCreate)}`
      );
    }

    await this.safeBoxRepositoryDatabase.create({
      ...data,
      _id: apiCreate.data?.detail[0]._id.$oid,
      conteudo: JSON.stringify(content),
      data_hora_create: apiCreate.data.detail[0].data_hora_create.$date,
      data_atualizacao: apiCreate.data.detail[0].data_atualizacao.$date,
      usuarios_escrita: JSON.stringify(data.usuarios_escrita),
      usuarios_leitura: JSON.stringify(data.usuarios_leitura),
      usuarios_escrita_deletado: JSON.stringify(data.usuarios_escrita_deletado),
      usuarios_leitura_deletado: JSON.stringify(data.usuarios_leitura_deletado),
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
}
