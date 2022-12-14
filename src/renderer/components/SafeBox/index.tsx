/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext } from 'react';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import styles from './styles.module.sass';
import { SafeBoxIcon, SafeBoxIconType } from '../SafeBoxIcon';

interface SafeBoxProps {
  safeBox: ISafeBox;
}

export function SafeBoxInfo({ safeBox }: SafeBoxProps) {
  const { changeCurrentSafeBox } = useContext(SafeBoxesContext);
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`${styles.safeBox} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
      onClick={() => changeCurrentSafeBox(safeBox)}
    >
      <SafeBoxIcon type={safeBox.tipo as SafeBoxIconType} />
      <div className={styles.text}>
        <h3>{safeBox?.nome}</h3>
        <p>Anotação</p>
        <p>{safeBox?.descricao}</p>
      </div>
    </div>
  );
}
