import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import produce from 'immer';
import { ActionType } from './actions';

interface SafeBoxGroupState {
  safeBoxGroup: ISafeBoxGroup[];
  currentSafeBoxGroup: ISafeBoxGroup | null;
}

export function safeBoxGroupReducer(state: SafeBoxGroupState, action: any) {
  switch (action.type) {
    case ActionType.UPDATE_SAFE_BOX_GROUP:
      return produce(state, (draft) => {
        draft.safeBoxGroup = action.payload.safeBoxGroup;
      });

    case ActionType.UPDATE_CURRENT_SAFE_BOX_GROUP:
      return produce(state, (draft) => {
        draft.currentSafeBoxGroup = action.payload.safeBoxGroup;
      });
    default:
      return state;
  }
}
