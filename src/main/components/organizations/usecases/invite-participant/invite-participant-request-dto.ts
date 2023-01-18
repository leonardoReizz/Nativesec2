export interface InviteParticipantRequestDTO {
  email: string;
  organizationId: string;
  type: 'writeAndRead' | 'read';
}
