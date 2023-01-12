import { myDatabase } from '../../../ipc/database';
import { UserConfigRepositoryDatabaseInterface } from './user-config-repository-database-interface';

export class UserConfigRepositoryDatabase
  implements UserConfigRepositoryDatabaseInterface
{
  update(data: any): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      return myDatabase.run(
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
}
