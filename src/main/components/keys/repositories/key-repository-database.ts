import { newDatabase } from '../../../main';
import { KeyRepositoryDatabaseInterface } from './key-repository-database-interface';
import * as types from './types';

export class KeyRepositoryDatabase implements KeyRepositoryDatabaseInterface {
  async delete(email: string): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM private_keys WHERE email = '${email}'`, (error) => {
        if (error) {
          console.log(error, ' ERRO DATABASE DELETE ORGANIZATION');
          reject(error);
        }
        resolve(true);
      });
    });
  }

  async getPublicKey(email: string): Promise<any[] | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM public_keys WHERE email = '${email}'`,
        (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        }
      );
    });
  }

  async getPrivateKey(email: string): Promise<any[] | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM private_keys WHERE email = '${email}'`,
        (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        }
      );
    });
  }

  async createPrivateKey(
    data: types.ICreatePrivateKeyData
  ): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      return db.run(
        `INSERT INTO private_keys (
          email,
          full_name,
          private_key,
          type
          ) VALUES (
            '${data.email}',
            '${data.fullName}',
            '${data.privateKey}',
            '${data.defaultType}'
          )`,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }

  async createPublicKey(
    data: types.ICreatePublicKeyData
  ): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      return db.run(
        `INSERT INTO public_keys (
          email,
          full_name,
          public_key,
          type
        ) VALUES (
          '${data.email}',
          '${data.fullName}',
          '${data.publicKey}',
          '${data.defaultType}'
        )`,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }
}
