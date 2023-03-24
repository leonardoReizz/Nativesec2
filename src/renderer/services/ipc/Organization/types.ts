export interface IRemoveUserData {
  organizationId: string;
  email: string;
  type: 'admin' | 'participant';
  changeUser?: boolean;
}

export interface IRemoveInviteData {
  organizationId: string;
  email: string;
  type: 'guestAdmin' | 'guestParticipant';
  changeUser?: boolean;
}

export interface IUpdateOrganizationData {
  organizationId: string;
  name: string;
  theme: string;
  description: string;
  icon: string;
}

export interface IAddNewParticipantData {
  email: string;
  type: 'guestAdmin' | 'guestParticipant';
  organizationId: string;
}

export interface ICreateOrganizationData {
  name: string;
  description: string;
  theme: string;
  icon: string | undefined;
  adminGuest: string[];
  participantGuest: string[];
}
