import { KeyRepositoryAPI } from '@/main/components/keys/repositories/key-repository-api';
import { store } from '@/main/main';
import { IKeys, IToken } from '@/main/types';
import { IUserConfig } from '@/renderer/contexts/UserConfigContext/types';
import { UserConfigRepositoryDatabase } from '../../repositories/user-config-repository-database';
import { UpdateUserConfigRequestDTO } from './update-user-config-request-dto';

export class UpdateUserConfigUseCase {
  constructor(
    private userConfigRepositoryDatabase: UserConfigRepositoryDatabase,
    private keyRepositoryAPI: KeyRepositoryAPI
  ) {}

  async execute(data: UpdateUserConfigRequestDTO) {
    const userConfig = store.get('userConfig') as IUserConfig;
    const { privateKey } = store.get('keys') as IKeys;
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    store.set('userConfig', { ...data });

    if (data.savePrivateKey !== userConfig.savePrivateKey) {
      if (data.savePrivateKey === 'false') {
        const deleteKeyAPI = await this.keyRepositoryAPI.delete(
          { privateKey, type: 'rsa' },
          authorization
        );

        if (deleteKeyAPI.status !== 200)
          throw new Error('ERRO DELETE PRIVATE KEY -> API');
      } else {
        const createKeyAPI = await this.keyRepositoryAPI.createPrivateKey(
          { chave: privateKey, tipo: 'rsa' },
          authorization
        );

        if (createKeyAPI.status !== 200)
          throw new Error('ERRO CREATE PRIVATE KEY -> API');
      }
    }

    return this.userConfigRepositoryDatabase.update(data);
  }
}
