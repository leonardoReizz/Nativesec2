import { ICreateOrganization } from '../../../ipc/organizations/types';
import { APIResponse } from '../../../types';
import * as types from './types';

export interface IOrganizationRepositoryAPI {
  create(
    organization: ICreateOrganization,
    authorization: string
  ): Promise<APIResponse>;
  inviteParticipant(data: types.InviteParticipantData): Promise<APIResponse>;
  inviteAdmin(data: types.InviteAdminData): Promise<APIResponse>;
  delete(organizationId: string): Promise<APIResponse>;
  update(data: types.IUpdateData, authorization: string): Promise<APIResponse>;
  removeParticipant(data: types.IRemoveParticipantData): Promise<APIResponse>;
  removeAdmin(data: types.IRemoveAdminData): Promise<APIResponse>;
  removeInviteAdmin(data: types.IRemoveInviteAdminData): Promise<APIResponse>;
  removeInviteParticipant(
    data: types.IRemoveInviteParticipantData
  ): Promise<APIResponse>;
}
