import { newDatabase } from '@/main/main';
import { ISafeBoxGroupModelDatabase } from '../model/safe-box-group';
import { ISafeBoxGroupRepositoryDatabaseInterface } from './safe-box-group-repository-database-interface ';

export class SafeBoxGroupRepositoryDatabase
  implements ISafeBoxGroupRepositoryDatabaseInterface
{
  async listByOrganizationId(
    organizationId: string
  ): Promise<ISafeBoxGroupModelDatabase[] | Error> {
    const db = newDatabase.getDatabase();

    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM safeboxGroup WHERE organizacao = '${organizationId}'`,
        (error, rows) => {
          if (error) reject(error);
          resolve(rows);
        }
      );
    });
  }

  async list(): Promise<ISafeBoxGroupModelDatabase[] | Error> {
    const db = newDatabase.getDatabase();

    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM safeboxGroup `, (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    });
  }

  async create(
    safeBoxGroup: ISafeBoxGroupModelDatabase
  ): Promise<true | Error> {}
}
