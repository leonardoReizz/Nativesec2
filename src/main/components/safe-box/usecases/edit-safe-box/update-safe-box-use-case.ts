import { KeyRepositoryAPI } from '@/main/components/keys/repositories/key-repository-api';
import openpgp from '@/main/crypto/openpgp';
import { store } from '@/main/main';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxAPIModel } from '../../model/SafeBox';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IUpdateSafeBoxRequestDTO } from './update-safe-box-request-dto';

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
          throw new Error(
            `${
              (store.get('user') as any)?.email
            }: Error API get public key, ${JSON.stringify(apiGetPubKey)}`
          );
        } catch (error) {
          throw new Error(
            `${
              (store.get('user') as any)?.email
            }: Error API get public key, ${JSON.stringify(error)}`
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

    if (apiUpdate.status !== 200 || apiUpdate.data.status !== 'ok') {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error API update safe box, ${JSON.stringify(apiUpdate)}`
      );
    }
    const updatedSafeBox: SafeBoxAPIModel = apiUpdate.data.detail[0];
    await this.safeBoxRepositoryDatabase.update({
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
}
