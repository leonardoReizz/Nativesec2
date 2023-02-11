import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { ICreateOrganizationRequestDTO } from './create-organization-request-dto';
import { CreateOrganizationUseCase } from './create-organization-usecase';

export class CreateOrganizationController {
  constructor(private createOrganizationUseCase: CreateOrganizationUseCase) {}

  async handle(organization: ICreateOrganizationRequestDTO) {
    try {
      const create = await this.createOrganizationUseCase.execute(organization);
      return {
        response: IPCTypes.CREATE_ORGANIZATION_RESPONSE,
        data: create,
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
