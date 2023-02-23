import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { IDeclineOrganizationInviteRequestDTO } from './decline-organization-invite-request-DTO';
import { DeclineOrganizationInviteUseCase } from './decline-organization-invite-use-case';
import '@sentry/tracing';

export class DeclineOrganizationInviteController {
  constructor(
    private declineOrganizationInviteUseCase: DeclineOrganizationInviteUseCase
  ) {}

  async handle(data: IDeclineOrganizationInviteRequestDTO) {
    try {
      const message = await this.declineOrganizationInviteUseCase.execute(data);
      return {
        response: IPCTypes.DECLINE_ORGANIZATION_INVITE_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);

      return {
        response: IPCTypes.DECLINE_ORGANIZATION_INVITE_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
