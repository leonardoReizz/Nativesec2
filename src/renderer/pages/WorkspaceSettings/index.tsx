import { useCallback, useState } from 'react';
import { Members, Settings, Sidebar } from './components/index';
import styles from './styles.module.sass';

export type workspaceSettingsStateType = 'members' | 'settings';

export function WorkspaceSettings() {
  const [workspaceSettingsState, setWorkspaceSettingsState] =
    useState<workspaceSettingsStateType>('members');

  const updateWorkspaceSettingsState = useCallback(
    (newState: workspaceSettingsStateType) => {
      setWorkspaceSettingsState(newState);
    },
    []
  );
  return (
    <div className={styles.workspaceSettings}>
      <Sidebar
        workspaceSettingsState={workspaceSettingsState}
        updateWorkspaceSettingsState={updateWorkspaceSettingsState}
      />
      {workspaceSettingsState === 'members' && <Members />}
      {workspaceSettingsState === 'settings' && <Settings />}
    </div>
  );
}
