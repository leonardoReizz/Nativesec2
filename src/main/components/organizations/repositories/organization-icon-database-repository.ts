/* eslint-disable class-methods-use-this */
import { newDatabase } from '../../../main';
import { OrganizationIconModelDatabase } from '../model/Organization';
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
      db.run(
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
      db.run(
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

  async list(): Promise<OrganizationIconModelDatabase[] | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM organizationsIcons`, (error, rows) => {
        if (error) {
          console.log(error, 'ERROR  DATABASE  LIST MY INVITES');
          reject(error);
        }

        resolve(rows);
      });
    });
  }

  async update({
    organizationId,
    icon,
  }: types.IUpdateIconData): Promise<boolean | Error> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `
         UPDATE organizationsIcons SET
         icone = '${icon}'
         WHERE _id = '${organizationId}'
       `,
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
