/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { useSafeBox } from '@/renderer/hooks/useSafeBox/useSafeBox';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './styles.module.sass';
import { SafeBoxIcon, SafeBoxIconType } from '../SafeBoxIcon';

interface SafeBoxProps {
  safeBox: ISafeBox;
}

export function SafeBoxInfo({ safeBox }: SafeBoxProps) {
  const { changeCurrentSafeBox } = useSafeBox();
  const { theme } = useUserConfig();
  const { organizationId } = useParams();
  const navigate = useNavigate();

  function handleCurrentSafeBox() {
    changeCurrentSafeBox(safeBox);
    navigate(`/organization/${organizationId}/viewSafeBox/${safeBox._id}/view`);
  }

  return (
    <div
      className={`${styles.safeBox} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
      onClick={handleCurrentSafeBox}
    >
      <SafeBoxIcon type={safeBox.tipo as SafeBoxIconType} />
      <div className={styles.text}>
        <h3>{safeBox?.nome}</h3>
        <p>{safeBox?.descricao}</p>
      </div>
    </div>
  );
}
