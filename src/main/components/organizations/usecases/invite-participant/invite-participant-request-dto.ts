export interface InviteParticipantRequestDTO {
  email: string;
  organizationId: string;
  type: 'admin' | 'participant';
}
