export interface IParticipant {
  email: string;
  type: 'participant' | 'admin';
  label: string;
  value: string;
}

export interface IFormikItem {
  name?: string;
  text?: string;
  element?: string;
  type?: string;
  [value: string]: any;
}
