import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { ICreateOrganizationRequestDTO } from './create-organization-request-dto';
import { CreateOrganizationUseCase } from './create-organization-usecase';
import '@sentry/tracing';

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
      Sentry.captureException(error);
      return {
        response: IPCTypes.CREATE_ORGANIZATION_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
