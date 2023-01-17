export interface AddNewParticipantRequestDTO {
  email: string;
  type: 'writeAndRead' | 'read';
}
