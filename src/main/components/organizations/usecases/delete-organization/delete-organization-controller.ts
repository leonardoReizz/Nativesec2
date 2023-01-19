import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { DeleteOrganizationUseCase } from './delete-organization-use-case';

export class DeleteOrganizationController {
  constructor(private deleteOrganizationUseCase: DeleteOrganizationUseCase) {}

  async handle(organizationId: string) {
    try {
      const create = await this.deleteOrganizationUseCase.execute(
        organizationId
      );
      return {
        response: IPCTypes.DELETE_ORGANIZATION_RESPONSE,
        data: {
          message: 'ok',
        },
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
