/* eslint-disable import/no-mutable-exports */
import sqlite3 from '@journeyapps/sqlcipher';
import { store } from '../../main';
import database from '../../database/database';
import DB from '../../database';
import { migration } from '../../database/migrations';
import { IInitialData, IUser } from '../../types';
import { IPCTypes } from '../../../renderer/@types/IPCTypes';
import { UseIPCData } from '..';

export let myDatabase: sqlite3.Database;

export function setDatabase(db: sqlite3.Database) {
  myDatabase = db;
}

export async function updateDatabase() {
  await migration();
  return {
    response: IPCTypes.UPDATE_DATABASE_RESPONSE,
  };
}
