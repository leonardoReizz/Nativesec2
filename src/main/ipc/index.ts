import { deletePrivateKeyController } from '../components/keys/use-cases/delete-private-key';
import { updateUserConfigController } from '../components/user-config/use-cases/update-user';
import { decryptController } from '../components/crypto/use-cases/decrypt';
import { updateSafeBoxController } from '../components/safe-box/usecases/edit-safe-box';
import { deleteSafeBoxController } from '../components/safe-box/usecases/delete-safe-box';
import { createSafeBoxController } from '../components/safe-box/usecases/create-safe-box';
import { IPCTypes } from '../../renderer/@types/IPCTypes';
import { initializeDB, updateDatabase } from './database';
import {
  generateParKeys,
  getPrivateKey,
  getPublicKey,
  insertDatabaseKeys,
  validatePrivateKeySafetyPhrase,
} from './keys';
import {
  createOrganization,
  getMyInvites,
  refreshAllOrganizations,
} from './organizations';
import { refreshSafeBoxes } from './safeBox';
import {
  authLogin,
  authPassword,
  getUser,
  setUserConfig,
  verifyDatabasePassword,
} from './user';

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
      return authPassword(arg);
    case IPCTypes.AUTH_LOGIN:
      return authLogin(arg);
    case IPCTypes.VERIFY_DATABASE_PASSWORD:
      return verifyDatabasePassword();
    case IPCTypes.GET_PRIVATE_KEY:
      return getPrivateKey(arg);
    case IPCTypes.VALIDATE_PRIVATE_KEY:
      return validatePrivateKeySafetyPhrase(arg);
    case IPCTypes.UPDATE_DATABASE:
      return updateDatabase();
    case IPCTypes.REFRESH_ALL_ORGANIZATIONS:
      return refreshAllOrganizations(arg);
    case IPCTypes.GET_PUBLIC_KEY:
      return getPublicKey();
    case IPCTypes.SET_USER_CONFIG:
      return setUserConfig();
    case IPCTypes.INITIALIZEDB:
      return initializeDB(arg);
    case IPCTypes.INSERT_DATABASE_KEYS:
      return insertDatabaseKeys();
    case IPCTypes.GET_USER:
      return getUser();
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
      return createOrganization(arg);
    case IPCTypes.DECRYPT_TEXT:
      return decryptController.handle(arg.data);
    case IPCTypes.UPDATE_SAFE_BOX:
      return updateSafeBoxController.handle(arg.data);
    case IPCTypes.UPDATE_USER_CONFIG:
      return updateUserConfigController.handle(arg.data);
    case IPCTypes.DELETE_PRIVATE_KEY:
      return deletePrivateKeyController.handle(arg.data);
    default:
      return {
        response: 'none',
        data: {
          message: 'nok',
        },
      };
  }
}
