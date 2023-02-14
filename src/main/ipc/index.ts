import { IPCTypes } from '@/types/IPCTypes';
import { updateDatabaseController } from '../components/database/use-cases/update-database';
import { forceRefreshSafeBoxesController } from '../components/safe-box/usecases/force-refresh-safe-boxes';
import { refreshAllSafeBoxesController } from '../components/safe-box/usecases/refresh-all-safe-boxes';
import { refreshSafeBoxesController } from '../components/safe-box/usecases/refresh-safe-boxes';
import { leaveOrganizationController } from '../components/organizations/usecases/leave-organization';
import { listOrganizationsInvitesController } from '../components/organizations/usecases/list-organizations-invites';
import { acceptOrganizationInviteController } from '../components/organizations/usecases/accept-organization-invite';
import { verifyUserPasswordController } from '../components/user/use-cases/verify-user-password';
import { refreshOrganizationController } from '../components/organizations/usecases/refresh-organizations';
import { updateUsersSafeBoxController } from '../components/safe-box/usecases/update-users';
import { addUsersController } from '../components/safe-box/usecases/add-users';
import { listSafeBoxController } from '../components/safe-box/usecases/list-safe-box';
import { removeInviteParticipantController } from '../components/organizations/usecases/remove-invite-participant';
import { removeParticipantController } from '../components/organizations/usecases/remove-participant';
import { verifyUserRegisteredController } from '../components/user/use-cases/verify-user-registered';
import { createUserController } from '../components/user/use-cases/create-user';
import { getPrivateKeyController } from '../components/keys/use-cases/get-private-key';
import { insertKeysController } from '../components/keys/use-cases/insert-keys';
import { generateTokenController } from '../components/auth/use-cases/generateToken';
import { refreshTokenController } from '../components/auth/use-cases/refreshToken';
import { loginController } from '../components/auth/use-cases/login';
import { getPublicKeyController } from '../components/keys/use-cases/get-public-key';
import { setUserConfigController } from '../components/user-config/use-cases/set-user-config';
import { getUserController } from '../components/user/use-cases/getUser';
import { updateOrganizationController } from '../components/organizations/usecases/update-organization';
import { inviteParticipantController } from '../components/organizations/usecases/invite-participant';
import { deleteOrganizationController } from '../components/organizations/usecases/delete-organization';
import { createOrganizationController } from '../components/organizations/usecases/create-organization';
import { deletePrivateKeyController } from '../components/keys/use-cases/delete-private-key';
import { updateUserConfigController } from '../components/user-config/use-cases/update-user';
import { decryptController } from '../components/crypto/use-cases/decrypt';
import { updateSafeBoxController } from '../components/safe-box/usecases/edit-safe-box';
import { deleteSafeBoxController } from '../components/safe-box/usecases/delete-safe-box';
import { createSafeBoxController } from '../components/safe-box/usecases/create-safe-box';
import { declineOrganizationInviteController } from '../components/organizations/usecases/decline-organization-invite';
import { changeSafetyPhraseController } from '../components/user/use-cases/change-safety-phrase';

export interface UseIPCData {
  id: string;
  event: string;
  data?: any;
}

export interface UseIpcActionsReturn {
  response: string;
  data?: any;
}

export async function useIpcActions(
  arg: UseIPCData
): Promise<UseIpcActionsReturn> {
  switch (arg.event) {
    case IPCTypes.AUTH_PASSWORD:
      return generateTokenController.handle(arg.data);
    case IPCTypes.AUTH_LOGIN:
      return loginController.handle(arg.data);
    case IPCTypes.CREATE_USER:
      return createUserController.handle(arg.data);
    case IPCTypes.VERIFY_USER_REGISTERED:
      return verifyUserRegisteredController.handle(arg.data);
    case IPCTypes.REFRESH_TOKEN:
      return refreshTokenController.handle();
    case IPCTypes.VERIFY_DATABASE_PASSWORD:
      return verifyUserPasswordController.handle();
    case IPCTypes.GET_PRIVATE_KEY:
      return getPrivateKeyController.handle();
    case IPCTypes.REFRESH_ALL_ORGANIZATIONS:
      return refreshOrganizationController.execute();
    case IPCTypes.GET_PUBLIC_KEY:
      return getPublicKeyController.handle();
    case IPCTypes.SET_USER_CONFIG:
      return setUserConfigController.handle();
    case IPCTypes.INSERT_DATABASE_KEYS:
      return insertKeysController.handle();
    case IPCTypes.GET_USER:
      return getUserController.handle();
    case IPCTypes.REFRESH_SAFE_BOXES:
      return refreshSafeBoxesController.handle(arg.data);
    case IPCTypes.LIST_SAFE_BOXES:
      return listSafeBoxController.handle(arg.data);
    case IPCTypes.LIST_MY_INVITES:
      return listOrganizationsInvitesController.handle();
    case IPCTypes.CREATE_SAFE_BOX:
      return createSafeBoxController.handle(arg.data);
    case IPCTypes.DELETE_SAFE_BOX:
      return deleteSafeBoxController.handle(arg.data);
    case IPCTypes.CREATE_ORGANIZATION:
      return createOrganizationController.handle(arg.data);
    case IPCTypes.DECRYPT_TEXT:
      return decryptController.handle(arg.data);
    case IPCTypes.UPDATE_SAFE_BOX:
      return updateSafeBoxController.handle(arg.data);
    case IPCTypes.UPDATE_USER_CONFIG:
      return updateUserConfigController.handle(arg.data);
    case IPCTypes.DELETE_PRIVATE_KEY:
      return deletePrivateKeyController.handle(arg.data);
    case IPCTypes.DELETE_ORGANIZATION:
      return deleteOrganizationController.handle(arg.data);
    case IPCTypes.ADD_NEW_PARTICIPANT_ORGANIZATION:
      return inviteParticipantController.handle(arg.data);
    case IPCTypes.UPDATE_ORGANIZATION:
      return updateOrganizationController.handle(arg.data);
    case IPCTypes.REMOVE_PARTICIPANT_ORGANIZATION:
      return removeParticipantController.handle(arg.data);
    case IPCTypes.REMOVE_INVITE_PARTICIPANT:
      return removeInviteParticipantController.handle(arg.data);
    case IPCTypes.ADD_SAFE_BOX_USERS:
      return addUsersController.handle(arg.data);
    case IPCTypes.UPDATE_USERS_SAFE_BOX:
      return updateUsersSafeBoxController.handle(arg.data);
    case IPCTypes.ACCEPT_ORGANIZATION_INVITE:
      return acceptOrganizationInviteController.handle(arg.data);
    case IPCTypes.DECLINE_ORGANIZATION_INVITE:
      return declineOrganizationInviteController.handle(arg.data);
    case IPCTypes.LEAVE_ORGANIZATION:
      return leaveOrganizationController.handle(arg.data);
    case IPCTypes.REFRESH_ALL_SAFE_BOXES:
      return refreshAllSafeBoxesController.handle();
    case IPCTypes.FORCE_REFRESH_SAFE_BOXES:
      return forceRefreshSafeBoxesController.handle(arg.data);
    case IPCTypes.UPDATE_DATABASE:
      return updateDatabaseController.handle();
    case IPCTypes.CHANGE_SAFETY_PHRASE:
      return changeSafetyPhraseController.handle(arg.data);
    default:
      return {
        response: 'none',
        data: {
          message: 'nok',
        },
      };
  }
}
