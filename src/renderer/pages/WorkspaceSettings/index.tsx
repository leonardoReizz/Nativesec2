import { useCallback, useState } from 'react';
import { Members, Settings, Sidebar } from './components/index';
import styles from './styles.module.sass';

type workspaceSettingsStateType = 'members' | 'settings';

export function WorkspaceSettings() {
  const [workspaceSettingsState, setWorkspaceSettingsState] =
    useState<workspaceSettingsStateType>('members');

  const changeWorkspaceSettingsState = useCallback(
    (newState: workspaceSettingsStateType) => {
      setWorkspaceSettingsState(newState);
    },
    []
  );
  return (
    <div className={styles.workspaceSettings}>
      <Sidebar />
      {workspaceSettingsState === 'members' && <Members />}
      {workspaceSettingsState === 'settings' && <Settings />}
    </div>
  );
}
