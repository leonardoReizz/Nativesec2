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
      { privateKeyId: data.privateKeyId },
      authorization
    );

    if (deleteKeyAPI.status !== 200 || deleteKeyAPI.data.status !== 'ok') {
      throw new Error(
        `${
          (store.get('user') as any)?.email
        }: Error API delete private key, ${JSON.stringify(deleteKeyAPI)}`
      );
    }

    return deleteKeyAPI;
  }
}
