/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useContext } from 'react';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import styles from './styles.module.sass';

export function UserSettings() {
  const { theme, changeTheme } = useContext(ThemeContext);

  function handleTheme(theme: 'light' | 'dark') {
    changeTheme(theme);
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
          Exportar Chave de Segurança
        </div>
        <div className={styles.box}>
          Exportar Chave de Segurança
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
        <div className={styles.box}>
          Tempo de Atualização
        </div>
      </div>
    </div>
  )
}
