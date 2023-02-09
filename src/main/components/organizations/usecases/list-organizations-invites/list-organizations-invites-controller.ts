import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { ListOrganizationsInvitesUseCase } from './list-organizations-invites-use-case';

export class ListOrganizationsInvitesController {
  constructor(
    private listOrganizationsUseCase: ListOrganizationsInvitesUseCase
  ) {}

  async handle() {
    try {
      const message = await this.listOrganizationsUseCase.execute();

      return {
        response: IPCTypes.LIST_MY_INVITES_RESPONSE,
        data: message,
      };
    } catch (error) {
      console.log(error);
      return {
        response: IPCTypes.LIST_MY_INVITES_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
