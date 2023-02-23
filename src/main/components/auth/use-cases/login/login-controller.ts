import { IPCTypes } from '@/types/IPCTypes';
import { ILoginRequestDTO } from './login-request-dto';
import { LoginUseCase } from './login-use-case';

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async handle(data: ILoginRequestDTO) {
    try {
      const message = await this.loginUseCase.execute(data);

      return {
        response: IPCTypes.AUTH_LOGIN_RESPONSE,
        data: {
          message,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        response: IPCTypes.AUTH_LOGIN_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
