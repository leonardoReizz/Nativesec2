import { AuthRepositoryAPI } from '../../repositories/auth-repository-api';
import { IGenerateTokenRequestDTO } from './generate-token-request-dto';

export class GenerateTokenUseCase {
  constructor(private authRepositoryAPI: AuthRepositoryAPI) {}

  async execute(data: IGenerateTokenRequestDTO) {
    const result = await this.authRepositoryAPI.generateToken(data.email);

    if (result.status === 200 && result.data.status === 'ok') {
      return 'ok';
    }
    return 'nok';
  }
}
