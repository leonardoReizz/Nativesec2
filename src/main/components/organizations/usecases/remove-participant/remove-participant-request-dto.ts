export interface IRemoveParticipantRequestDTO {
  organizationId: string;
  type: 'admin' | 'participant';
  email: string;
  changeUser?: boolean;
}
