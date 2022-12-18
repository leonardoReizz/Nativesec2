import { APIResponse } from 'main/types';
import { SafeBoxAPIModel } from '../model/SafeBox';
import { DeleteSafeBoxAPI } from './types';

export interface SafeBoxRepositoryAPIInterface {
  create: (
    data: SafeBoxAPIModel,
    authorization: string
  ) => Promise<APIResponse>;
  delete: (data: DeleteSafeBoxAPI) => Promise<APIResponse>;
}
