import { IUpdateSafeBoxGroupAPIData } from './types';

export interface ISafeBoxGroupRepositoryAPIInterface {
  list(organizationId: string, authorization: string): Promise<APIResponse>;
  update(
    safeBox: IUpdateSafeBoxGroupAPIData,
    authorization: string
  ): Promise<APIResponse>;
}
