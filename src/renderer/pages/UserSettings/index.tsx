/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { BiExport } from 'react-icons/bi';
import { Dropdown } from 'renderer/components/Dropdown';
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
  const { theme, updateTheme, updateRefreshTime, refreshTime, savePrivateKey } =
    useUserConfig();

  console.log(refreshTime);

  function handleTheme(newTheme: 'light' | 'dark') {
    updateTheme(newTheme);
  }

  function changeValue(value: string) {
    updateRefreshTime(Number(value));
  }

  return (
    <div
      className={`${styles.userSettings} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      <div className={styles.container}>
        <h3>Segurança</h3>
        <div className={styles.box}>
          <div>
            <BiExport />
            Exportar Chave de Segurança
          </div>
        </div>
        <div className={styles.box}>
          <div>
            <span
              className={`${styles.checkBox} ${
                savePrivateKey ? styles.checked : ''
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
