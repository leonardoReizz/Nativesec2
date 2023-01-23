/* eslint-disable class-methods-use-this */
import { myDatabase } from '../../../ipc/database';
import { IOrganizationIconRepositoryDatabase } from './organization-icon-repository-database-interface';
import * as types from './types';

export class OrganizationIconRepositoryDatabase
  implements IOrganizationIconRepositoryDatabase
{
  async create(
    data: types.ICreateOrganizationIconData
  ): Promise<boolean | Error> {
    return new Promise((resolve, reject) => {
      return myDatabase.run(
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
    return new Promise((resolve, reject) => {
      return myDatabase.run(
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
    return new Promise((resolve, reject) => {
      myDatabase.run(
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
