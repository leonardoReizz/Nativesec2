import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';

export enum ActionType {
  UPDATE_SAFE_BOX_GROUP = 'UPDATE_SAFE_BOX_GROUP',
  UPDATE_CURRENT_SAFE_BOX_GROUP = 'UPDATE_CURRENT_SAFE_BOX_GROUP',
}

export function updateSafeBoxGroupAction(safeBoxGroup: ISafeBoxGroup[]) {
  return {
    type: ActionType.UPDATE_SAFE_BOX_GROUP,
    payload: {
      safeBoxGroup,
    },
  };
}

export function updateCurrentSafeBoxGroupAction(
  safeBoxGroup: ISafeBoxGroup | null
) {
  return {
    type: ActionType.UPDATE_CURRENT_SAFE_BOX_GROUP,
    payload: {
      safeBoxGroup,
    },
  };
}
