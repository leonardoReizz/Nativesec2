export interface ICreateUser {
  myEmail: string;
  myFullName: string;
  safetyPhrase: string;
}

export interface ISetTheme {
  theme: 'light' | 'dark';
}

export interface IChangeSafetyPhrase {
  newSecret: string;
}
