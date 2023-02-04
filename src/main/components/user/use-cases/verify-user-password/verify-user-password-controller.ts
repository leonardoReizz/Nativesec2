import { IPCTypes } from 'renderer/@types/IPCTypes';

export class VerifyUserPassword {
  constructor() {}

  async handle() {
    try {
    } catch (error) {
      return {
        response: IPCTypes.VERIFY_DATABASE_PASSWORD_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
