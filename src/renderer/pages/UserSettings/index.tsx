import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { BiExport } from 'react-icons/bi';
import { Dropdown } from 'renderer/components/Dropdown';
import Buffer from 'buffer';
import { useIPCUserConfig } from 'renderer/hooks/useIPCUserConfig.ts';
import { IKeys, IUser } from 'main/types';
import styles from './styles.module.sass';

const refreshTimeOptions = [
  {
    id: 1,
    value: '15',
  },
  {
    id: 2,
    value: '30',
  },
  {
    id: 3,
    value: '60',
  },
];

export function UserSettings() {
  const {
    theme,
    updateTheme,
    updateRefreshTime,
    refreshTime,
    savePrivateKey,
    updateSavePrivateKey,
  } = useUserConfig();

  useIPCUserConfig();

  function handleTheme(newTheme: 'light' | 'dark') {
    updateTheme(newTheme);
  }

  function saveFile(privateKey: string) {
    const { myEmail } = window.electron.store.get('user') as IUser;
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
    element.download = myEmail;
    element.click();
  }

  function handleExportKey() {
    const { privateKey } = window.electron.store.get('keys') as IKeys;
    saveFile(privateKey);
  }
  function changeValue(value: string) {
    updateRefreshTime(Number(value));
  }

  function handleSavePrivateKey() {
    const save = savePrivateKey === 'false' ? 'true' : 'false';
    updateSavePrivateKey(save);
  }

  return (
    <div
      className={`${styles.userSettings} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.container}>
        <h3>Segurança</h3>
        <div className={styles.box} onClick={handleExportKey}>
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
        <div className={styles.box} onClick={() => handleTheme('light')}>
          <div>
            <span
              className={`${styles.checkBox} ${
                theme === 'light' ? styles.checked : ''
              }`}
            />
            Tema Claro
          </div>
        </div>
        <div className={styles.box} onClick={() => handleTheme('dark')}>
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
            onChange={(value) => changeValue(value)}
          />
          {/* <select name="" id="">
            <option value="">15 Segundos</option>
            <option value="">30 Segundos</option>
            <option value="">60 Segundos</option>
          </select> */}
        </div>
      </div>
    </div>
  );
}
