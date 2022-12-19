/* eslint-disable import/no-cycle */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-shadow */
import sqlite3 from '@journeyapps/sqlcipher';
import database from './database';

import { DEFAULT_TYPE, ICreatePrivateKey } from './types';

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
            async (err, rows) => {
              if (err?.message === 'SQLITE_ERROR: no such table: public_keys') {
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

// const getUserConfig = async ({ db, myEmail }: IGetSelectedOrganization) => {
//   return db.all(
//     `select * from user_config where email = '${myEmail}'`,
//     async (err, rows) => {
//       if (err) {
//         console.log(err, ' getUserConfig Error');
//       } else {
//         resolve(rows[0]);
//       }
//     }
//   );
// };

// const createPrivateKey = async ({
//   myEmail,
//   myFullName,
//   privateKey,
//   db,
// }: ICreatePrivateKey) => {
//   return new Promise((resolve, reject) => {
//     db.run(
//       `INSERT INTO private_keys (email, full_name, private_key, type) VALUES ('${myEmail.toLowerCase()}', '${myFullName}', '${privateKey}', '${DEFAULT_TYPE}')`,
//       async (err: any, res: unknown) => {
//         if (err) {
//           console.log(err, ' createPrivateKey Error');
//           reject(err);
//         } else {
//           resolve(true);
//         }
//       }
//     );
//   })
//     .then((result) => {
//       return result;
//     })
//     .catch((err) => {
//       console.log(err);
//       return false;
//     });
// };

// const createPublicKey = async ({
//   myEmail,
//   myFullName,
//   publicKey,
//   db,
// }: ICreatePublicKey) => {
//   return new Promise((resolve, reject) => {
//     db.run(
//       `INSERT INTO public_keys (email, full_name, public_key, type) VALUES ('${myEmail.toLowerCase()}', '${myFullName}', '${publicKey}', '${DEFAULT_TYPE}')`,
//       async (err: any, res: any) => {
//         if (err) reject(err);
//         resolve(true);
//       }
//     );
//   })
//     .then((result) => {
//       return result;
//     })
//     .catch((err) => {
//       console.log(err);
//       return err;
//     });
// };

// const getPrivateKey = async ({ db, myEmail }: IGetLocalPrivateKeyProps) => {
//   return new Promise<IGetLocalPrivateKey | undefined>((resolve, reject) => {
//     db.all(
//       `select * from private_keys where email = '${myEmail}' and type='${DEFAULT_TYPE}'`,
//       async (err, rows) => {
//         if (err) {
//           console.log(err, ' getPrivateKey Error');
//           reject(err);
//         } else {
//           resolve(rows[0]);
//         }
//       }
//     );
//   });
// };

// const getPublicKey = async ({ db, myEmail }: IGetLocalPublicKeyProps) => {
//   return new Promise<IGetLocalPublicKey | undefined>((resolve, reject) => {
//     db.all(
//       `select * from public_keys where email = '${myEmail}' and type='${DEFAULT_TYPE}'`,
//       async (err, rows) => {
//         if (err) {
//           console.log(err, ' getPublicKeyt Error');
//           reject(err);
//         } else {
//           resolve(rows[0]);
//         }
//       }
//     );
//   });
// };

export default {
  Init,
  verifyPasswordDB,
};
