import sqlite3 from '@journeyapps/sqlcipher';
import database from './database';

import { DEFAULT_TYPE } from './types';

interface IInit {
  db: sqlite3.Database;
  secret: string;
  event?: Electron.IpcMainEvent;
}

const Init = async ({ db, secret, event }: IInit) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('PRAGMA cipher_compatibility = 4');
      db.run(`PRAGMA key = '${secret}'`);
      db.run(`PRAGMA SQLITE_THREADSAFE=2`);
      db.run('SELECT count(*) FROM sqlite_master;', async (err) => {
        if (err) {
          console.log(err, ' Init error');
          reject(err);
          event?.reply(`initializeDB-response`, {
            status: 403,
            data: { status: 'nok', msg: 'Senha Invalida' },
          });
        } else {
          db.all(
            `select * from public_keys where email = '' and type='${DEFAULT_TYPE}'`,
            async (error, rows) => {
              if (
                error?.message === 'SQLITE_ERROR: no such table: public_keys'
              ) {
                database.CreateTables(db);
              }
            }
          );
          resolve(db);
        }
      });
    });
    return db;
  })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const verifyPasswordDB = async ({ db, secret }: IInit) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('PRAGMA cipher_compatibility = 4');
      db.run(`PRAGMA key = '${secret}'`);
      db.run('SELECT count(*) FROM sqlite_master;', async (err) => {
        if (err) {
          console.log(err, '  verifyPasswordDB Error ');
          reject(err);
        } else {
          resolve('create');
        }
      });
    });

    return db;
  });
};

export default {
  Init,
  verifyPasswordDB,
};
