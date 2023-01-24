import { APIResponse } from '../../../types';

export interface UserRepositoryApiInterface {
  getUser: (authorization: string) => Promise<APIResponse>;
}
