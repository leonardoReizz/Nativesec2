import { IPCTypes } from '@/types/IPCTypes';
import { UpdateDatabaseUseCase } from './update-database-use-case';

export class UpdateDatabaseController {
  constructor(private updateDatabaseUseCase: UpdateDatabaseUseCase) {}

  async handle() {
    try {
      const message = await this.updateDatabaseUseCase.execute();
      return {
        response: IPCTypes.UPDATE_DATABASE_RESPONSE,
        data: message,
      };
    } catch (error) {
      return {
        response: IPCTypes.UPDATE_DATABASE_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
