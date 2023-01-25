import { APIResponse } from '../../../types';
import { KeyAPI } from '../model/Key';
import * as types from './types';

export interface KeyRepositoryAPIInterface {
  createPrivateKey: (
    data: types.ICreatePrivateKeyData,
    authorization: string
  ) => Promise<APIResponse>;
  createPublicKey: (
    data: types.ICreatePublicKeyData,
    authorization: string
  ) => Promise<APIResponse>;
  delete: (data: KeyAPI, authorization: string) => Promise<APIResponse>;
  getPrivateKey: (email: string, authorization: string) => Promise<APIResponse>;
  getPublicKey: (email: string, authorization: string) => Promise<APIResponse>;
}
