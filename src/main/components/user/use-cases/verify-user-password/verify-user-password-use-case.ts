import { store } from '@/main/main';
import { IInitialData, IUser } from '@/main/types';
import fs from 'fs';
import md5 from 'md5';
import { UserRepositoryDatabase } from '../../repositories/user-repository-database';

export class VerifyUserPasswordUseCase {
  constructor(private userRepositoryDatabase: UserRepositoryDatabase) {}

  async execute() {
    const { email, safetyPhrase } = store.get('user') as IUser;
    const { PATH } = store.get('initialData') as IInitialData;

    if (fs.existsSync(`${PATH}/database/default/${md5(email)}.sqlite3`)) {
      const verify: any =
        await this.userRepositoryDatabase.verifyDatabasePassword({
          PATH,
          myEmail: email,
          safetyPhrase,
        });

      if (verify.errno === 26) {
        return {
          message: 'invalidSafetyPhrase',
        };
      }
      return {
        message: 'ok',
      };
    }
    return {
      message: 'ok',
    };
  }
}
