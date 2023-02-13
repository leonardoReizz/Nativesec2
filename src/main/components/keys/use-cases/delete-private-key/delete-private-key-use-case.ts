import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { KeyRepositoryAPI } from '../../repositories/key-repository-api';
import { DeletePrivateKeyRequestDTO } from './delete-private-key-request-dto';

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
