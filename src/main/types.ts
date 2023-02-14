import sqlite3 from '@journeyapps/sqlcipher';

export interface IInitialData {
  PATH: string;
  locale_string: string;
  version: string;
  hostname: string;
  updateAvaliable: boolean;
  updateInfo: {
    message: string;
    detail: string;
  };
}

export interface IUser {
  fullName: string;
  savePrivateKey: string | null;
  refreshTime: number;
  theme: ThemeType;
  lastOrganizationId: string | null;
  email: string;
  safetyPhrase: string;
}

export interface IToken {
  accessToken: string;
  tokenType: string;
}

export interface UseIPCData {
  id?: string;
  event: string;
  data?: any;
}

export interface RemoveIPCQueueData {
  id: string;
  event: string;
  data: string;
}

export interface AuthPasswordData {
  id: string;
  event: string;
  data: {
    email: string;
    type: string;
  };
}
export interface QueueType {
  id: string;
  event: string;
  data: any;
  ipcEvent: Electron.IpcMainEvent;
}

export interface IGenerateParKeys {
  myEmail: string;
  myFullName: string;
  safetyPhrase: string;
}

export interface IKeys {
  privateKey: string;
  privateKeyId: string;
  publicKey: string;
  publicKeyId: string;
  savePrivateKey: boolean;
}

export interface APIResponse {
  data: any;
  status: number;
}

export type DatabaseType = sqlite3.Database;
