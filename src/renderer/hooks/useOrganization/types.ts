export interface ICreateOrganization {
  name: string;
  description: string;
  theme: string;
  icon: string | undefined;
  adminGuest: string[];
  participantGuest: string[];
}

export interface IAddNewParticipantData {
  email: string;
  type: 'guestAdmin' | 'guestParticipant';
  organizationId: string;
}

export interface IUpdateOrganizationData {
  organizationId: string;
  name: string;
  theme: string;
  description: string;
  icon: string;
}

export interface IRemoveUser {
  organizationId: string;
  email: string;
  type: 'admin' | 'participant';
  changeUser?: boolean;
}

export interface IRemoveInvite {
  organizationId: string;
  email: string;
  type: 'guestAdmin' | 'guestParticipant';
  changeUser?: boolean;
}

export interface ILeaveOrganizationData {
  organizationId: string;
}
