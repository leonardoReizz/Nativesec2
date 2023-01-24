import produce from 'immer';
import { ActionType } from './actions';

interface UserConfigState {
  lastOrganizationId: string;
  refreshTime: number;
  theme: string;
  savePrivateKey: string;
  email: '';
}

export function userConfigReducer(state: UserConfigState, action: any) {
  switch (action.type) {
    case ActionType.UPDATE_LAST_ORGANIZATION_ID:
      return produce(state, (draft) => {
        draft.lastOrganizationId = action.payload.newLastOrganizationId;
      });
    case ActionType.UPDATE_REFRESH_TIME:
      return produce(state, (draft) => {
        draft.refreshTime = action.payload.newRefreshTime;
      });
    case ActionType.UPDATE_SAVE_PRIVATE_KEY:
      return produce(state, (draft) => {
        draft.savePrivateKey = action.payload.newSavePrivateKey;
      });
    case ActionType.UPDATE_THEME:
      return produce(state, (draft) => {
        draft.theme = action.payload.newTheme;
      });
    case ActionType.UPDATE_USER_CONFIG:
      return produce(state, (draft) => {
        draft.lastOrganizationId = action.payload.lastOrganizationId;
        draft.refreshTime = action.payload.refreshTime;
        draft.savePrivateKey = action.payload.savePrivateKey;
        draft.theme = action.payload.theme;
      });
    default:
      return state;
  }
}
