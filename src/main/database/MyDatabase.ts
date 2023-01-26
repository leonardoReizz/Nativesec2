import sqlite3 from '@journeyapps/sqlcipher';
import fs from 'fs';
import path from 'path';
import md5 from 'md5';
import { IInitialData, IUser } from '../types';
import { store } from '../main';
import tables, { ITables } from './tables';
import { DEFAULT_TYPE, ICreateDatabase, IInit } from './types';

export class Database {
  private database: sqlite3.Database | undefined;

  public getDatabase(): sqlite3.Database | undefined {
    return this.database;
  }

  build = async () => {
    const { myEmail, safetyPhrase } = store.get('user') as IUser;
    const { PATH } = store.get('initialData') as IInitialData;

    if (fs.existsSync(`${PATH}/database/default/${md5(myEmail)}.sqlite3`)) {
      const db = await this.createDatabase({ myEmail, PATH });
      const DB = await this.init({ db, secret: safetyPhrase });

      if (DB instanceof Error) {
        return DB;
      }

      this.database = db;

      return db;
    }
    await this.createPATH(PATH);
    const db = await this.createDatabase({ myEmail, PATH });
    await this.init({ db, secret: safetyPhrase });
    await this.createTables(db);

    this.database = db;

    return db;
  };

  init = async ({ db, secret }: IInit): Promise<sqlite3.Database | Error> => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('PRAGMA cipher_compatibility = 4');
        db.run(`PRAGMA key = '${secret}'`);
        db.run(`PRAGMA SQLITE_THREADSAFE=2`);
        db.run('SELECT count(*) FROM sqlite_master;', async (err) => {
          if (err) {
            console.log(err, ' Init database error');
            reject(err);
          }
          resolve(db);
        });
      });
    })
      .then((result) => {
        return result as sqlite3.Database;
      })
      .catch((error) => {
        return error as Error;
      });
  };

  createPATH = async (PATH: string, WORKSPACE = 'default') => {
    if (!fs.existsSync(path.join(PATH, 'database'))) {
      fs.mkdir(path.join(PATH, 'database'), async (err) => {
        if (err) {
          console.error(err, 'err2');
        }
        if (!fs.existsSync(path.join(PATH, 'database', WORKSPACE))) {
          fs.mkdir(path.join(PATH, 'database', WORKSPACE), async (error) => {
            if (error) {
              console.error(error, 'err2');
            }
          });
        }
      });
    } else if (!fs.existsSync(path.join(PATH, 'database', WORKSPACE))) {
      fs.mkdir(path.join(PATH, 'database', WORKSPACE), (err) => {
        if (err) {
          console.error(err, 'err1');
        }
      });
    }
  };

  createTables = async (db: sqlite3.Database) => {
    tables.forEach(async (table: ITables) => {
      await new Promise((resolve, reject) => {
        db.run(table.query, async (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(table.name);
          }
        });
      });
    });
  };

  createDatabase = async ({
    myEmail,
    PATH,
    WORKSPACE = 'default',
  }: ICreateDatabase): Promise<sqlite3.Database> => {
    return new sqlite3.Database(
      `${PATH}/database/${WORKSPACE}/${md5(myEmail)}.sqlite3`,
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  };
}
