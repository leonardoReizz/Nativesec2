import { APIResponse } from '../../../types';
import { IUserAPIModel } from '../model/User';

export interface UserRepositoryApiInterface {
  getUser: (authorization: string) => Promise<APIResponse>;
  create: (data: Omit<IUserAPIModel, 'disabled'>) => Promise<APIResponse>;
}
