import { APIResponse } from '../../../types';
import { KeyAPI } from '../model/Key';

export interface KeyRepositoryAPIInterface {
  create: (data: any, authorization: string) => Promise<APIResponse>;
  delete: (data: KeyAPI, authorization: string) => Promise<APIResponse>;
  getPrivateKey: (email: string, authorization: string) => Promise<APIResponse>;
  getPublicKey: (email: string, authorization: string) => Promise<APIResponse>;
}
