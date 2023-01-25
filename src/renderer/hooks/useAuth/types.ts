export interface IAuthPasswordData {
  email: string;
}

export interface IAuthLoginData {
  token: string;
}

export interface ICreateUserData {
  email: string;
  fullName: string;
  safetyPhrase: string;
}
