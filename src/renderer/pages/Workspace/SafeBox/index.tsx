import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import styles from './styles.module.sass';

interface SafeBoxProps {
  safeBox: ISafeBox;
}

export function SafeBox({ safeBox }: SafeBoxProps) {
  return (
    <div className={styles.safeBox}>
      {safeBox.nome}
    </div>
  )
}
