import { ICreateOrganization } from 'main/ipc/organizations/types';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { CreateOrganizationUseCase } from './create-organization-usecase';

export class CreateOrganizationController {
  constructor(private createOrganizationUseCase: CreateOrganizationUseCase) {}

  async handle(organization: ICreateOrganization) {
    try {
      await this.createOrganizationUseCase.execute(organization);

      return {
        response: IPCTypes.CREATE_ORGANIZATION_RESPONSE,
        data: {
          message: 'ok',
        },
      };
    } catch (error) {
      return {
        response: IPCTypes.CREATE_ORGANIZATION_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
