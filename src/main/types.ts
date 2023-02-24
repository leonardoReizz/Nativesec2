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

export type DatabaseType = sqlite3.Database;
