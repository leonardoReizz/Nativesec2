/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import sqlite3 from '@journeyapps/sqlcipher';
import fs from 'fs';
import path from 'path';
import md5 from 'md5';
import { IInitialData, IUser } from '../types';
import { store } from '../main';
import tables, { ITables } from './tables';
import { DEFAULT_TYPE, ICreateDatabase, IInit } from './types';
import { versions } from './migrations/versions';

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

  // ChangeSafetyPhrase = async ({ newSafetyPhrase, db }: IChangeSafetyPhrase) => {
  //   try {
  //     const { myEmail, myFullName, safetyPhrase } = store.get('user') as IUser;
  //     const { privateKey } = store.get('keys') as IKeys;
  //     const { tokenType, accessToken } = store.get('token') as IToken;
  //     const privateKeyDecrypt = await openpgp.decryptKey({
  //       privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
  //       passphrase: safetyPhrase,
  //     });

  //     const newKey = await openpgp.reformatKey({
  //       privateKey: privateKeyDecrypt,
  //       userIDs: [{ email: myEmail.toLowerCase(), name: myFullName }],
  //       passphrase: newSafetyPhrase,
  //     });

  //     const userConfig = store.get('userConfig') as IUserConfig;
  //     if (Boolean(userConfig.savePrivateKey) === true) {
  //       const result = await axios
  //         .delete(`${api}/privatekey/`, {
  //           data: {
  //             chave: privateKey,
  //             tipo: 'rsa',
  //           },
  //           headers: {
  //             Authorization: `${tokenType} ${accessToken}`,
  //           },
  //         })
  //         .then(async (result) => {
  //           return true;
  //         })
  //         .catch((err) => {
  //           return false;
  //         });
  //       if (result === true) {
  //         axios
  //           .post(
  //             `${api}/privatekey/`,
  //             {
  //               chave: newKey.privateKey,
  //               tipo: DEFAULT_TYPE,
  //             },
  //             {
  //               headers: {
  //                 Authorization: `${tokenType} ${accessToken}`,
  //               },
  //             }
  //           )
  //           .catch((err) => {
  //             console.log('APIPrivateKeyError: ', err);
  //             throw new Error('APIPrivateKeyError');
  //           });
  //       }
  //     }
  //     store.set('keys', {
  //       ...(store.get('keys') as IKeys),
  //       privateKey: newKey.privateKey,
  //     });

  //     db.all(
  //       `UPDATE private_keys SET private_key ='${newKey.privateKey}' WHERE email = '${myEmail}'`
  //     );

  //     return true;
  //   } catch (err) {
  //     console.log(err);
  //     return false;
  //   }
  // };

  migration = async () => {
    const version: any = await this.database.all(
      `SELECT * FROM database_version`
    );

    if (version[0] === undefined) {
      await this.database.run(
        `INSERT INTO database_version (version) VALUES ('${version}') `
      );
    } else if (version[0] !== null) {
      if (version[0].version !== version) {
        await this.database.run(
          `UPDATE database_version SET version = '${version}'`
        );
      }
    }

    // Update Database
    const currentVersionNumber = Number(version[0].version.replaceAll('.', ''));
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
        const updateDatase = require(`./versions/${v?.version}.ts`);
        await updateDatase.update();
      });
    }
  };
}
