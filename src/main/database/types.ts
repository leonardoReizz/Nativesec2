import sqlite3 from '@journeyapps/sqlcipher';

export interface IInit {
  db: sqlite3.Database;
  secret: string;
  event?: Electron.IpcMainEvent;
}

export interface ICreateDatabase {
  myEmail: string;
  PATH: string;
  WORKSPACE?: string;
}

export interface IChangeSafetyPhrase {
  newSafetyPhrase: string;
  db: sqlite3.Database;
}

export const DEFAULT_TYPE = 'rsa';
