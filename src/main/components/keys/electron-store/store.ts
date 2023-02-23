import { IUserConfig } from 'renderer/contexts/UserConfigContext/types';
import { store } from '../../../main';

export async function changeSavePrivateKey(save: boolean) {
  store.set('userConfig', {
    ...(store.get('userConfig') as IUserConfig),
    savePrivateKey: save,
  });
}
