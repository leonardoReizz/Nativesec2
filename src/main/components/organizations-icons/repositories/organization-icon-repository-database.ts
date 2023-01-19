/* eslint-disable class-methods-use-this */
import { myDatabase } from '../../../ipc/database';
import * as types from './types';
import { OrganizationIconRepositoryInterface } from './organization-icon-repository-interface';

export class OrganizationIconRepositoryDatabase
  implements OrganizationIconRepositoryInterface
{
  async create(
    data: types.CreateOrganizationIconData
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
}
