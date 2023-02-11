export interface ICreateOrganizationRequestDTO {
  name: string;
  theme: string;
  description: string;
  icon: string;
  adminGuests: string[];
  participantGuests: string[];
}
