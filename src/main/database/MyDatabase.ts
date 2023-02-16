/* eslint-disable no-new */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import sqlite3 from '@journeyapps/sqlcipher';
import fs from 'fs';
import path from 'path';
import md5 from 'md5';
import { IInitialData, IUser } from '../types';
import { store } from '../main';
import tables, { ITables } from './tables';
import { ICreateDatabase, IInit } from './types';
import { versions } from './migrations/versions';

const { version: currentVersion } = require('../../../package.json');

export class Database {
  private database: sqlite3.Database | undefined;

  public getDatabase(): sqlite3.Database | undefined {
    return this.database;
  }

  build = async () => {
    const { email, safetyPhrase } = store.get('user') as IUser;
    const { PATH } = store.get('initialData') as IInitialData;

    if (fs.existsSync(`${PATH}/database/default/${md5(email)}.sqlite3`)) {
      const db = await this.createDatabase({ myEmail: email, PATH });
      const DB = await this.init({ db, secret: safetyPhrase });

      if (DB instanceof Error) {
        return DB;
      }

      this.database = db;
      return db;
    }
    await this.createPATH(PATH);
    const createDatabase = await this.createDatabase({ myEmail: email, PATH });
    await this.init({ db: createDatabase, secret: safetyPhrase });
    await this.createTables(createDatabase);

    const db = await this.createDatabase({ myEmail: email, PATH });
    await this.init({ db, secret: safetyPhrase });
    this.database = db;

    return db;
  };

  clear = async () => {
    this.database = undefined;
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

  changeSafetyPhrase = async (newSafetyPhrase: string) => {
    return new Promise((resolve, reject) => {
      this.database.run(`PRAGMA rekey = '${newSafetyPhrase}'`, (error) => {
        if (error) reject(error);
        resolve(true);
      });
    });
  };

  migration = async () => {
    const version: any = await new Promise((resolve, reject) => {
      this.database.all(`SELECT * FROM database_version`, (error, rows) => {
        if (error) reject(error);
        resolve(rows[0]);
      });
    });

    console.log(currentVersion);

    if (version === undefined) {
      const insertVersion = new Promise((resolve, reject) => {
        this.database.run(
          `INSERT INTO database_version (version) VALUES ('${currentVersion}') `,
          (error) => {
            if (error) reject(error);
            resolve(true);
          }
        );
      });

      if (insertVersion instanceof Error)
        throw new Error(
          `${
            (store.get('user') as any)?.email
          }: Error DATABASE insert database version, ${JSON.stringify(
            insertVersion
          )}`
        );
    } else if (version[0] !== null) {
      if (version.version !== currentVersion) {
        const updateDatabase = new Promise((resolve, reject) => {
          this.database.run(
            `UPDATE database_version SET version = '${currentVersion}'`,
            (error) => {
              if (error) reject(error);
              resolve(true);
            }
          );
        });

        if (updateDatabase instanceof Error)
          throw new Error(
            `${
              (store.get('user') as any)?.email
            }: Error DATABASE update database version, ${JSON.stringify(
              updateDatabase
            )}`
          );
      }
    }

    // Update Database
    const currentVersionNumber = Number(currentVersion.replaceAll('.', ''));
    const listToUpdate = versions
      .map((v) => {
        if (v.number > currentVersionNumber) {
          return v;
        }
        return undefined;
      })
      .filter((v) => v !== undefined);

    if (listToUpdate.length > 0) {
      listToUpdate.map(async (v) => {
        const updateDatase = require(`./migrations/versions/${v?.version}.ts`);
        await updateDatase.update(this.database);
      });
    }
  };
}
