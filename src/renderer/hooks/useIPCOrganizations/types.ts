import { IOrganization } from 'renderer/contexts/OrganizationsContext/types';

export interface CreateOrganizationResponse {
  message: 'ok' | 'nok';
  organization: IOrganization;
}

export interface IRemoveParticipantResponse {
  message: 'ok' | 'nok' | 'noKey';
  email: string;
  type: 'admin' | 'participant';
  changeUser?: boolean;
  data: any;
}

export interface IRemoveInviteParticipantResponse {
  message: 'ok' | 'nok' | 'noKey';
  email: string;
  type: 'guestAdmin' | 'guestParticipant';
  changeUser?: boolean;
  data: any;
}
