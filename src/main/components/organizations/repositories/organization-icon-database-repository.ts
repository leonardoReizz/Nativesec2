/* eslint-disable class-methods-use-this */
import { newDatabase } from '../../../main';
import { IOrganizationIconRepositoryDatabase } from './organization-icon-repository-database-interface';
import * as types from './types';

export class OrganizationIconRepositoryDatabase
  implements IOrganizationIconRepositoryDatabase
{
  async create(
    data: types.ICreateOrganizationIconData
  ): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      return db.run(
        `INSERT INTO organizationsIcons (_id, icone ) VALUES ('${data.organizationId}','${data.icon}')`,
        (error) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }

  async delete(organizationId: string): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      return db.run(
        `DELETE FROM organizationsIcons WHERE _id = '${organizationId}'`,
        (error) => {
          if (error) {
            console.log(error);
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }

  async update(organizationId: string, icon: string): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `
         UPDATE organizationsIcons SET
         icone = '${icon}'
         WHERE _id = '${organizationId}'
       `,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }
}
