import { IPCTypes } from '@/types/IPCTypes';
import { IRefreshOrganizationRequestDTO } from './refresh-organization-request-dto';
import { RefreshOrganizationsUseCase } from './refresh-organizations-use-case';

export class RefreshOrganizationsController {
  constructor(
    private refreshOrganizationsUseCase: RefreshOrganizationsUseCase
  ) {}

  async execute(data: IRefreshOrganizationRequestDTO) {
    try {
      const message = await this.refreshOrganizationsUseCase.execute();

      return {
        response: data?.type
          ? IPCTypes.REFRESH_ALL_ORGANIZATIONS_REFRESH_RESPONSE
          : IPCTypes.REFRESH_ALL_ORGANIZATIONS_RESPONSE,
        data: message,
      };
    } catch (error) {
      return {
        response: data?.type
          ? IPCTypes.REFRESH_ALL_ORGANIZATIONS_REFRESH_RESPONSE
          : IPCTypes.REFRESH_ALL_ORGANIZATIONS_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
