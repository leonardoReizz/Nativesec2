import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { RefreshOrganizationsUseCase } from './refresh-organizations-use-case';

export class RefreshOrganizationsController {
  constructor(
    private refreshOrganizationsUseCase: RefreshOrganizationsUseCase
  ) {}

  async execute() {
    try {
      const message = await this.refreshOrganizationsUseCase.execute();

      return {
        response: IPCTypes.REFRESH_ALL_ORGANIZATIONS_RESPONSE,
        data: message,
      };
    } catch (error) {
      return {
        response: IPCTypes.REFRESH_ALL_ORGANIZATIONS_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
