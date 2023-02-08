import { IPCTypes } from '../../../../../renderer/@types/IPCTypes';
import { ILeaveOrganizationRequestDTO } from './leave-organization-request-dto';
import { LeaveOrganizationUseCase } from './leave-organization-use-case';

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
      return {
        response: IPCTypes.LEAVE_ORGANIZATION_RESPONSE,
        data: {
          message: 'nok',
        },
      };
    }
  }
}
