import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { DeleteOrganizationUseCase } from './delete-organization-use-case';
import '@sentry/tracing';

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
      Sentry.captureException(error);
      return {
        response: IPCTypes.DELETE_ORGANIZATION_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
