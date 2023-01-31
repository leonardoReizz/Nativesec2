export interface InviteParticipantRequestDTO {
  email: string;
  organizationId: string;
  type: 'guestAdmin' | 'guestParticipant';
}
