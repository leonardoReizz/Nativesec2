/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { BiExport } from 'react-icons/bi';
import { Dropdown } from 'renderer/components/Dropdown';
import Buffer from 'buffer';
import { useIPCUserConfig } from '@/renderer/hooks/useIPCUserConfig.ts/useIPCUserConfig.ts';
import { IKeys, IUser } from 'main/types';
import { Button } from 'renderer/components/Buttons/Button';
import { MdPassword } from 'react-icons/md';
import { IPCTypes } from '@/types/IPCTypes';
import { useCallback, useState } from 'react';
import styles from './styles.module.sass';
import { ChangeSafetyPhraseModal } from './components/ChangeSafetyPhraseModal';

interface IItem {
  id: number;
  value: number | string;
  label: string;
}

const refreshTimeOptions = [
  {
    id: 1,
    value: 15,
    label: '15',
  },
  {
    id: 2,
    value: 30,
    label: '30',
  },
  {
    id: 3,
    value: 60,
    label: '60',
  },
];

export function UserSettings() {
  const [isIOpenChangeSafetyPhraseModal, setIsIOpenChangeSafetyPhraseModal] =
    useState<boolean>(false);
  const {
    theme,
    updateTheme,
    updateRefreshTime,
    refreshTime,
    savePrivateKey,
    updateSavePrivateKey,
  } = useUserConfig();

  useIPCUserConfig();

  function saveFile() {
    const { privateKey } = window.electron.store.get('keys') as IKeys;
    const { email } = window.electron.store.get('user') as IUser;
    const byteCharacters = Buffer.Buffer.from(privateKey, 'utf-8').toString(
      'base64'
    );
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const element = document.createElement('a');
    const temp = new Blob([byteArray]);
    element.href = URL.createObjectURL(temp);
    element.download = email;
    element.click();
  }

  function changeValue(item: IItem) {
    updateRefreshTime(Number(item.value));
  }

  function handleSavePrivateKey() {
    const save = savePrivateKey === 'false' ? 'true' : 'false';
    updateSavePrivateKey(save);
  }

  function handleCloseSession() {
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.SESSION_EXPIRED,
    });
  }

  const closeChangeSafetyPhraseModal = useCallback(() => {
    setIsIOpenChangeSafetyPhraseModal(false);
  }, []);

  return (
    <>
      <ChangeSafetyPhraseModal
        isOpen={isIOpenChangeSafetyPhraseModal}
        onRequestClose={closeChangeSafetyPhraseModal}
        callback={() => {}}
        theme={theme}
      />
      <div
        className={`${styles.userSettings} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={styles.container}>
          <h3>Sessão</h3>
          <Button
            text="Encerrar Sessão"
            className={styles.leaveButton}
            theme={theme}
            color="red"
            onClick={handleCloseSession}
          />
          <h3>Segurança</h3>
          <div
            className={styles.box}
            onClick={() => setIsIOpenChangeSafetyPhraseModal(true)}
          >
            <div>
              <MdPassword />
              Alterar Senha
            </div>
          </div>
          <div className={styles.box} onClick={saveFile}>
            <div>
              <BiExport />
              Exportar Chave de Segurança
            </div>
          </div>
          <div className={styles.box} onClick={() => handleSavePrivateKey()}>
            <div>
              <span
                className={`${styles.checkBox} ${
                  savePrivateKey === 'true' ? styles.checked : ''
                }`}
              />
              Salvar chave de segurança nos servidores do NativeSec
            </div>
          </div>
          <h3>Aparencia</h3>
          <div className={styles.box} onClick={() => updateTheme('light')}>
            <div>
              <span
                className={`${styles.checkBox} ${
                  theme === 'light' ? styles.checked : ''
                }`}
              />
              Tema Claro
            </div>
          </div>
          <div className={styles.box} onClick={() => updateTheme('dark')}>
            <div>
              <span
                className={`${styles.checkBox} ${
                  theme === 'dark' ? styles.checked : ''
                }`}
              />
              Tema Escuro
            </div>
          </div>
          <h3>Cofres</h3>
          <div className={`${styles.box} ${styles.noHover} ${styles.dropdown}`}>
            <span>Tempo de Atualização</span>
            <Dropdown
              theme={theme}
              options={refreshTimeOptions}
              valueText="segundos"
              value={String(refreshTime)}
              onChange={(item) => changeValue(item)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
