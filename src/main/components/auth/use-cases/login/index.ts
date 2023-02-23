import { AuthRepositoryAPI } from '../../repositories/auth-repository-api';
import { LoginController } from './login-controller';
import { LoginUseCase } from './login-use-case';

const authRepository = new AuthRepositoryAPI();

const loginUseCase = new LoginUseCase(authRepository);
const loginController = new LoginController(loginUseCase);

export { loginController };
