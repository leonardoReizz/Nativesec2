import { KeyRepositoryAPI } from 'main/components/keys/repositories/key-repository-api';

export class VerifyUserRegisteredUseCase {
  constructor(private keyRepositoryAPI: KeyRepositoryAPI) {}

  async execute() {
    const getApiPublicKey = await this.keyRepositoryAPI.getPublicKey();
  }
}
