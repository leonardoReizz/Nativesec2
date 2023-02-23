import { IPCTypes } from '@/types/IPCTypes';
import * as Sentry from '@sentry/node';
import { ILeaveOrganizationRequestDTO } from './leave-organization-request-dto';
import { LeaveOrganizationUseCase } from './leave-organization-use-case';
import '@sentry/tracing';

export class LeaveOrganizationController {
  constructor(private leaveOrganizationUseCase: LeaveOrganizationUseCase) {}

  async handle(data: ILeaveOrganizationRequestDTO) {
    try {
      const message = await this.leaveOrganizationUseCase.execute(data);
      return {
        response: IPCTypes.LEAVE_ORGANIZATION_RESPONSE,
        data: message,
      };
    } catch (error) {
      Sentry.captureException(error);
      return {
        response: IPCTypes.LEAVE_ORGANIZATION_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
