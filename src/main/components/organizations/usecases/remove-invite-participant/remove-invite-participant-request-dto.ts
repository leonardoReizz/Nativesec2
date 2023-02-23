export interface IRemoveInviteParticipantRequestDTO {
  organizationId: string;
  email: string;
  type: 'guestAdmin' | 'guestParticipant';
  changeUser?: boolean;
}
