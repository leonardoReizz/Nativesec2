import { IPCTypes } from '@/types/IPCTypes';
import { IUpdateOrganizationRequestDTO } from './update-organization-request-dto';
import { UpdateOrganizationUseCase } from './update-organization-use-case';

export class UpdateOrganizationController {
  constructor(private updateOrganizationUseCase: UpdateOrganizationUseCase) {}

  async handle(data: IUpdateOrganizationRequestDTO) {
    try {
      await this.updateOrganizationUseCase.execute(data);
      return {
        response: IPCTypes.UPDATE_ORGANIZATION_RESPONSE,
        data: {
          message: 'ok',
        },
      };
    } catch (error) {
      return {
        response: IPCTypes.UPDATE_ORGANIZATION_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
