import { ICreateOrganization } from '../../../ipc/organizations/types';
import { APIResponse } from '../../../types';
import * as types from './types';

export interface IOrganizationRepository {
  create(organization: ICreateOrganization): Promise<any>;
  inviteParticipant(data: types.InviteParticipantData): Promise<APIResponse>;
  inviteAdmin(data: types.InviteAdminData): Promise<APIResponse>;
}
