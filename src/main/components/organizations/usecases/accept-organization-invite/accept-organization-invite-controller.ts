import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { IAcceptOrganizationInviteRequestDTO } from './accept-organization-invite-request-dto';
import { AcceptOrganizationInviteUseCase } from './accept-organization-invite-use-case';

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
      console.log(error);
      return {
        response: IPCTypes.ACCEPT_ORGANIZATION_INVITE_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
