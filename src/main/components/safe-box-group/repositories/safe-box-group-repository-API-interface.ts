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
}
