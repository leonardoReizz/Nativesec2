import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { ListOrganizationsInvitesUseCase } from './list-organizations-invites-use-case';
import '@sentry/tracing';

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
      Sentry.captureException(error);
      return {
        response: IPCTypes.LIST_MY_INVITES_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
