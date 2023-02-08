import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IDeclineOrganizationInviteRequestDTO } from './decline-organization-invite-request-DTO';
import { DeclineOrganizationInviteUseCase } from './decline-organization-invite-use-case';

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
      return {
        response: IPCTypes.DECLINE_ORGANIZATION_INVITE_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
