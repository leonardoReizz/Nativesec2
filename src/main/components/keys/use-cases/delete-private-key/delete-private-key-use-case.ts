import { IToken } from '../../../../types';
import { store } from '../../../../main';
import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { DeletePrivateKeyRequestDTO } from './delete-private-key-request-dto';
import { changeSavePrivateKey } from '../../electron-store/store';

export class DeletePrivateKeyUseCase {
  constructor(private keyRepositoryAPI: KeyRepositoryAPI) {}

  async execute(data: DeletePrivateKeyRequestDTO) {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const deleteKeyAPI = await this.keyRepositoryAPI.delete(
      data,
      authorization
    );

    if (deleteKeyAPI.status !== 200 && deleteKeyAPI.data.status !== 'ok') {
      throw new Error('Erro delete private key -> API');
    }

    return deleteKeyAPI;
  }
}
