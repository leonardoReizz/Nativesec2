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
import { IPCTypes } from '../../renderer/@types/IPCTypes';
import { updateDatabase } from './database';
import { generateParKeys } from './keys';
import { getMyInvites, refreshAllOrganizations } from './organizations';
import { refreshSafeBoxes } from './safeBox';
import { verifyDatabasePassword } from './user';

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
      return verifyDatabasePassword();
    case IPCTypes.GET_PRIVATE_KEY:
      return getPrivateKeyController.handle();
    case IPCTypes.UPDATE_DATABASE:
      return updateDatabase();
    case IPCTypes.REFRESH_ALL_ORGANIZATIONS:
      return refreshAllOrganizations(arg);
    case IPCTypes.GET_PUBLIC_KEY:
      return getPublicKeyController.handle();
    case IPCTypes.SET_USER_CONFIG:
      return setUserConfigController.handle();
    case IPCTypes.INSERT_DATABASE_KEYS:
      return insertKeysController.handle();
    case IPCTypes.GET_USER:
      return getUserController.handle();
    case IPCTypes.REFRESH_SAFEBOXES:
      return refreshSafeBoxes(arg);
    case IPCTypes.GET_MY_INVITES:
      return getMyInvites();
    case IPCTypes.GENERATE_PAR_KEYS:
      return generateParKeys(arg);
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
    case IPCTypes.REMOVE_PARTICIPANT:
      return removeParticipantController.handle(arg.data);
    case IPCTypes.REMOVE_INVITE_PARTICIPANT:
      return removeInviteParticipantController.handle(arg.data);
    default:
      return {
        response: 'none',
        data: {
          message: 'nok',
        },
      };
  }
}
