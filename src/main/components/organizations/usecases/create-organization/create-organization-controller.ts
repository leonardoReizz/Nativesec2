import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { ICreateOrganization } from '../../../../ipc/organizations/types';
import { CreateOrganizationUseCase } from './create-organization-usecase';

export class CreateOrganizationController {
  constructor(private createOrganizationUseCase: CreateOrganizationUseCase) {}

  async handle(organization: ICreateOrganization) {
    console.log(organization, ' create');
    try {
      const create = await this.createOrganizationUseCase.execute(organization);
      return {
        response: IPCTypes.CREATE_ORGANIZATION_RESPONSE,
        data: create,
      };
    } catch (error) {
      console.log(error);
      return {
        response: IPCTypes.CREATE_ORGANIZATION_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
