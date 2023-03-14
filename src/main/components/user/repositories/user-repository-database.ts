import fs from 'fs';
import md5 from 'md5';
import { IUserConfigDatabaseModal } from '@/main/components/user/model/User';
import { OrganizationModelDatabase } from '@/main/components/organizations/model/Organization';
import { newDatabase } from '../../../main';
import * as types from './types';

export class UserRepositoryDatabase {
  async verifyDatabasePassword({
    PATH,
    myEmail,
    safetyPhrase,
  }: types.IVerifyDatabasePassword) {
    const db = await newDatabase.build();

    if (db instanceof Error) {
      return db;
    }

    if (fs.existsSync(`${PATH}/database/default/${md5(myEmail)}.sqlite3`)) {
      await newDatabase.createDatabase({ myEmail, PATH });
      const verify = await newDatabase.init({
        db,
        secret: safetyPhrase,
      });

      return verify;
    }

    return false;
  }

  async getUserConfigByEmail(
    email: string
  ): Promise<IUserConfigDatabaseModal | undefined> {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT *  FROM user_config WHERE email = '${email}'`,
        async (error, rows) => {
          if (error) {
            console.log(error, ' ERROR DATABASE FIND USER CONFIG BY EMAIL');
            reject(error);
          }
          if (rows.length > 0) {
            const config = rows[0] as IUserConfigDatabaseModal;
            resolve(config);
          }
          resolve(undefined);
        }
      );
    });
  }

  async createUserConfig(data: IUserConfigDatabaseModal) {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      return db.run(
        `
          INSERT INTO user_config (
          email,
          refreshTime,
          savePrivateKey,
          theme,
          lastOrganizationId
        )
        VALUES(
          '${data.email}',
          '${data.refreshTime}',
          '${data.savePrivateKey}',
          '${data.theme}',
          '${data.lastOrganizationId}'
        )
        `,
        (error) => {
          if (error) {
            console.log(error, ' ERRO DATABASE CREATE ORGANIZATION ICON');
            reject(error);
          }
          resolve(true);
        }
      );
    });
  }

  async updateUserConfig(data: IUserConfigDatabaseModal) {
    const db = newDatabase.getDatabase();
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE user_config SET
        savePrivateKey = '${data.savePrivateKey}',
        refreshTime = '${data.refreshTime}',
        theme = '${data.theme}',
        lastOrganizationId = '${data.lastOrganizationId}'
        WHERE email = '${data.email}',
      `,
        (error) => {
          if (error) reject(error);
          resolve(true);
        }
      );
    });
  }
}
