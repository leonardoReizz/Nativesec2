import produce from 'immer';
import { SafeBoxModeType } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { ActionType } from './actions';

interface SafeBoxesState {
  safeBoxes: ISafeBox[];
  currentSafeBox: ISafeBox | undefined;
  safeBoxesIsLoading: boolean;
  safeBoxMode: SafeBoxModeType;
  safeBoxIsOpen: boolean;
  createSafeBoxIsLoading: boolean;
}

export function safeBoxesReducer(state: SafeBoxesState, action: any) {
  switch (action.type) {
    case ActionType.UPDATE_SAFEBOXES:
      return produce(state, (draft) => {
        draft.safeBoxes = action.payload.safeBoxes;
      });
    case ActionType.CHANGE_CURRENT_SAFE_BOX:
      return produce(state, (draft) => {
        draft.currentSafeBox = action.payload.newCurrentSafeBox;
      });
    case ActionType.CHANGE_CREATE_SAFE_BOX_IS_LOADING:
      return produce(state, (draft) => {
        draft.createSafeBoxIsLoading = action.payload.isLoading;
      });
    case ActionType.CHANGE_SAFE_BOXES_IS_LOADING:
      return produce(state, (draft) => {
        draft.safeBoxesIsLoading = action.payload.isLoading;
      });
    case ActionType.CHANGE_SAFE_BOX_IS_OPEN:
      return produce(state, (draft) => {
        draft.safeBoxIsOpen = action.payload.isOpen;
      });
    case ActionType.CHANGE_SAFE_BOX_MODE:
      return produce(state, (draft) => {
        draft.safeBoxMode = action.payload.newSafeBoxMode;
      });
    default:
      return state;
  }
}
