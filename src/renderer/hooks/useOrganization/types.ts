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
  type: 'admin' | 'participant';
  organizationId: string;
}

export interface IUpdateOrganizationData {
  organizationId: string;
  name: string;
  theme: string;
  description: string;
  icon: string;
}
