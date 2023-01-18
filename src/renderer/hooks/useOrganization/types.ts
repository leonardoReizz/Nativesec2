export interface ICreateOrganization {
  name: string;
  description: string;
  theme: string;
  icon: string | undefined;
  adminGuest: string[];
  participantGuest: string[];
}
