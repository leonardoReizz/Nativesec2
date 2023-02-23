import { newDatabase } from '../../../main';
import { UserConfigRepositoryDatabaseInterface } from './user-config-repository-database-interface';
import { IUserConfigDatabaseModel } from '../Model/User';

export class UserConfigRepositoryDatabase
  implements UserConfigRepositoryDatabaseInterface
{
  update(data: any): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `
          UPDATE user_config SET
          lastOrganizationId = '${data.lastOrganizationId}',
          refreshTime = '${data.refreshTime}',
          theme = '${data.theme}',
          savePrivateKey = '${data.savePrivateKey}'
          WHERE email = '${data.email}'
        `,
        (error) => {
          if (error) {
            console.log(error, ' ERROR UPDATE USER DATABASE');
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }

  getUserConfig(email: string): Promise<IUserConfigDatabaseModel[] | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM user_config WHERE email = '${email}'`,
        (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        }
      );
    });
  }

  async create(data: IUserConfigDatabaseModel): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `
          insert into user_config (
            email,
            theme,
            savePrivateKey,
            lastOrganizationId,
            refreshTime
          )
          values (
            '${data.email.toLowerCase()}',
            '${data.theme}',
            '${data.lastOrganizationId}',
            '${data.savePrivateKey}',
            ${data.refreshTime}
          )
        `,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }
}
