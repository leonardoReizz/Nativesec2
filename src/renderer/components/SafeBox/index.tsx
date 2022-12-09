import { useContext } from 'react';
import { SiKubernetes } from 'react-icons/si';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { CgWebsite } from 'react-icons/cg';
import { MdOutlineAlternateEmail, MdOutlinePassword } from 'react-icons/md';
import { FcSafe, FcSimCardChip } from 'react-icons/fc';
import { HiTerminal } from 'react-icons/hi';
import { FaServer, FaMoneyCheckAlt } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { TbLicense, TbCloudDataConnection } from 'react-icons/tb';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import styles from './styles.module.sass';

interface SafeBoxProps {
  safeBox: ISafeBox;
}

export function SafeBox({ safeBox }: SafeBoxProps) {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`${styles.safeBox} ${
        theme === 'dark' ? styles.dark : styles.light
      }`}
    >
      {safeBox.tipo === 'bankAccount' ? (
        <span className={styles.bankAccount}>
          <FaMoneyCheckAlt />
        </span>
      ) : safeBox.tipo === 'annotation' ? (
        <span className={styles.annotation}>
          <IoDocumentText />
        </span>
      ) : safeBox.tipo === 'creditCard' ? (
        <FcSimCardChip />
      ) : safeBox.tipo === 'email' ? (
        <span className={styles.email}>
          <MdOutlineAlternateEmail />
        </span>
      ) : safeBox.tipo === 'kubeconfig' ? (
        <span className={styles.kubeconfig}>
          <SiKubernetes />
        </span>
      ) : safeBox.tipo === 'softwareLicense' ? (
        <span className={styles.softwareLicense}>
          <TbLicense />
        </span>
      ) : safeBox.tipo === 'login' ? (
        <span className={styles.login}>
          <MdOutlinePassword />
        </span>
      ) : safeBox.tipo === 'ssh' ? (
        <span className={styles.ssh}>
          <HiTerminal />
        </span>
      ) : safeBox.tipo === 'server' ? (
        <span className={styles.server}>
          <FaServer />
        </span>
      ) : safeBox.tipo === 'site' ? (
        <span className={styles.site}>
          <CgWebsite />
        </span>
      ) : safeBox.tipo === 'ftp' ? (
        <span className={styles.site}>
          <TbCloudDataConnection />
        </span>
      ) : (
        <FcSafe />
      )}
      <div className={styles.text}>
        <h3>{safeBox?.nome}</h3>
        <p>{safeBox?.descricao}</p>
      </div>
    </div>
  );
}
