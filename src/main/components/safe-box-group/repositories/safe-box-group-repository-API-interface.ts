import { ISafeBoxGroupModelAPI } from '../model/safe-box-group';
import * as t from './types';

export interface ISafeBoxGroupRepositoryAPIInterface {
  list(organizationId: string, authorization: string): Promise<APIResponse>;
  update(
    data: t.IUpdateSafeBoxGroupAPIData,
    authorization: string
  ): Promise<APIResponse>;
  delete(
    data: t.IDeleteSafeBoxGroupAPI,
    authorization: string
  ): Promise<APIResponse>;
  create(
    data: Omit<ISafeBoxGroupModelAPI, 'data_hora_create'| 'data_atualizacao'|  '_id' | 'dono'>,
    authorization: string;
  ): Promise<APIResponse>;
}
