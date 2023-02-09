import { AuthRepositoryAPI } from '../../repositories/auth-repository-api';
import { RefreshTokenController } from './refresh-token-controller';
import { RefreshTokenUseCase } from './refresh-token-use-case';

const authRepositoryAPI = new AuthRepositoryAPI();

const refreshTokenUseCase = new RefreshTokenUseCase(authRepositoryAPI);
const refreshTokenController = new RefreshTokenController(refreshTokenUseCase);

export { refreshTokenController };
