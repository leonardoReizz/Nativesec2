import { APIResponse } from '../../../types';
import { IPrivateKeyApiModel, IPublicKeyApiModel, KeyAPI } from '../model/Key';
import * as types from './types';

export interface KeyRepositoryAPIInterface {
  createPrivateKey: (
    data: IPrivateKeyApiModel,
    authorization: string
  ) => Promise<APIResponse>;
  createPublicKey: (
    data: IPublicKeyApiModel,
    authorization: string
  ) => Promise<APIResponse>;
  delete: (data: KeyAPI, authorization: string) => Promise<APIResponse>;
  getPrivateKey: (email: string, authorization: string) => Promise<APIResponse>;
  getPublicKey: (email: string, authorization: string) => Promise<APIResponse>;
}
