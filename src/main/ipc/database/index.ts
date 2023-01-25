/* eslint-disable import/no-mutable-exports */
import sqlite3 from '@journeyapps/sqlcipher';
import { migration } from '../../database/migrations';
import { IPCTypes } from '../../../renderer/@types/IPCTypes';

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
