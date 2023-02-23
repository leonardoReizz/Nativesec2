import { APIResponse } from 'main/types';
import * as types from './types';

export interface IAuthRepositoryAPI {
  login: (data: types.ILoginData) => Promise<APIResponse>;
  refreshToken: (authorization: string) => Promise<APIResponse>;
  generateToken: (email: string) => Promise<APIResponse>;
}
