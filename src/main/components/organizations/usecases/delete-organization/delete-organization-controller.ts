import { IPCTypes } from '@/types/IPCTypes';
import { DeleteOrganizationUseCase } from './delete-organization-use-case';

export class DeleteOrganizationController {
  constructor(private deleteOrganizationUseCase: DeleteOrganizationUseCase) {}

  async handle(organizationId: string) {
    try {
      const message = await this.deleteOrganizationUseCase.execute(
        organizationId
      );
      return {
        response: IPCTypes.DELETE_ORGANIZATION_RESPONSE,
        data: message,
      };
    } catch (error) {
      console.log(error);
      return {
        response: IPCTypes.DELETE_ORGANIZATION_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
