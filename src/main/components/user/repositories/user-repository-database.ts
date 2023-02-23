import fs from 'fs';
import md5 from 'md5';
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
}
