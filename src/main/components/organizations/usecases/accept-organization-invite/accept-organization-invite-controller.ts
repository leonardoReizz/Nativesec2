import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IAcceptOrganizationInviteRequestDTO } from './accept-organization-invite-request-dto';
import { AcceptOrganizationInviteUseCase } from './accept-organization-invite-use-case';
import '@sentry/tracing';

export class AcceptOrganizationInviteController {
  constructor(private acceptInviteUseCase: AcceptOrganizationInviteUseCase) {}

  async handle(data: IAcceptOrganizationInviteRequestDTO) {
    try {
      const message = await this.acceptInviteUseCase.execute(data);
      return {
        response: IPCTypes.ACCEPT_ORGANIZATION_INVITE_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.ACCEPT_ORGANIZATION_INVITE_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
