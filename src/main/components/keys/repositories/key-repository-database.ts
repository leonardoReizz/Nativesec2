import { myDatabase } from '../../../ipc/database';
import { KeyRepositoryDatabaseInterface } from './key-repository-database-interface';

export class KeyRepositoryDatabase implements KeyRepositoryDatabaseInterface {
  async delete(email: string): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      myDatabase.run(
        `DELETE FROM private_keys WHERE email = '${email}'`,
        (error) => {
          if (error) {
            console.log(error, ' ERRO DATABASE DELETE ORGANIZATION');
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }

  async getPublicKey(email: string): Promise<any[] | Error> {
    return new Promise((resolve, reject) => {
      return myDatabase.all(
        `SELECT * FROM public_keys WHERE email = '${email}'`,
        (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        }
      );
    });
  }
}
