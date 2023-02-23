import { AuthRepositoryAPI } from '../../repositories/auth-repository-api';
import { GenerateTokenController } from './generate-token-controller';
import { GenerateTokenUseCase } from './generate-token-use-case';

const authRepositoryAPI = new AuthRepositoryAPI();

const generateTokenUseCase = new GenerateTokenUseCase(authRepositoryAPI);
const generateTokenController = new GenerateTokenController(
  generateTokenUseCase
);

export { generateTokenController };
