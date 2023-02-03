import { KeyRepositoryAPI } from 'main/components/keys/repositories/key-repository-api';
import { IToken, IUser } from '../../../../types';
import { store } from '../../../../main';
import openpgp from '../../../../crypto/openpgp';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IAddUsersRequestDTO } from './add-users-request-dto';
import { refreshSafeBoxes } from '../../electron-store/store';

export class AddUsersUseCase {
  constructor(
    private safeBoxRepositoryAPI: SafeBoxRepositoryAPI,
    private safeBoxRepositoryDatabase: SafeBoxRepositoryDatabase,
    private keyRepositoryAPI: KeyRepositoryAPI
  ) {}

  async execute(data: IAddUsersRequestDTO) {
    const { safetyPhrase } = store.get('user') as IUser;
    const { accessToken, tokenType } = store.get('token') as IToken;

    const authorization = `${tokenType} ${accessToken}`;

    const users = [...data.usuarios_escrita, ...data.usuarios_leitura];
    let newContent = {};

    const content = Object.entries(data.conteudo);

    const arrayDecrypted = await Promise.all(
      content.map(async (item) => {
        if (item[1].startsWith('-----BEGIN PGP MESSAGE-----')) {
          const decrypted = await openpgp.decrypt({
            encryptedMessage: item[1],
            passphrase: safetyPhrase,
          });

          return {
            [`${item[0]}`]: decrypted,
            name: item[0],
            crypto: true,
          };
        }

        return {
          [`${item[0]}`]: item[1],
          name: item[0],
          crypto: false,
        };
      })
    );

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
      arrayDecrypted.map(async (item) => {
        if (!item.crypto) {
          newContent = {
            ...newContent,
            [`${item.name}`]: item[`${item.name}`],
          };
        } else {
          const encrypted = await openpgp.encrypt({
            message: item[`${item.name}`] as string,
            publicKeysArmored: pubKeys as string[],
          });

          newContent = {
            ...newContent,
            [`${item.name}`]: encrypted.encryptedMessage,
          };
        }
      })
    ).then(() => {
      return newContent;
    });

    const apiUpdate = await this.safeBoxRepositoryAPI.update(
      {
        ...data,
        id: data._id,
        conteudo: JSON.stringify(newContent),
        anexos: [],
      },
      authorization
    );

    console.log(apiUpdate);
    console.log(apiUpdate?.data?.detail[0]);

    if (apiUpdate.status === 200 && apiUpdate.data.status === 'ok') {
      await this.safeBoxRepositoryDatabase.update({
        ...data,
        _id: apiUpdate.data.detail[0]._id.$oid,
        conteudo: JSON.stringify(newContent),
        data_atualizacao: apiUpdate.data.detail[0].data_atualizacao.$date,
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
        anexos: JSON.stringify([]),
      });
      await refreshSafeBoxes(data.organizacao);

      return { message: 'ok', data: { safeBoxId: data._id } };
    }

    throw new Error('nok');
  }
}
