import { myDatabase } from 'main/ipc/database';
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
}
