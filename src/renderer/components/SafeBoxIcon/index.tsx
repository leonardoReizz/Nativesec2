import { SiKubernetes } from 'react-icons/si';
import { CgWebsite } from 'react-icons/cg';
import { MdOutlineAlternateEmail, MdOutlinePassword } from 'react-icons/md';
import { FcSafe, FcSimCardChip } from 'react-icons/fc';
import { HiTerminal } from 'react-icons/hi';
import { FaServer, FaMoneyCheckAlt } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { TbLicense, TbCloudDataConnection } from 'react-icons/tb';

import styles from './styles.module.sass';

interface SafeBoxIconProps {
  type: SafeBoxIconType;
}

export type SafeBoxIconType =
  | 'bankAccount'
  | 'annotation'
  | 'email'
  | 'creditCard'
  | 'kubeconfig'
  | 'softwareLicense'
  | 'login'
  | 'ssh'
  | 'server'
  | 'ftp'
  | 'site';

export function SafeBoxIcon({ type }: SafeBoxIconProps) {
  return (
    <div className={styles.icon}>
      {type === 'bankAccount' ? (
        <span className={styles.bankAccount}>
          <FaMoneyCheckAlt />
        </span>
      ) : type === 'annotation' ? (
        <span className={styles.annotation}>
          <IoDocumentText />
        </span>
      ) : type === 'creditCard' ? (
        <FcSimCardChip />
      ) : type === 'email' ? (
        <span className={styles.email}>
          <MdOutlineAlternateEmail />
        </span>
      ) : type === 'kubeconfig' ? (
        <span className={styles.kubeconfig}>
          <SiKubernetes />
        </span>
      ) : type === 'softwareLicense' ? (
        <span className={styles.softwareLicense}>
          <TbLicense />
        </span>
      ) : type === 'login' ? (
        <span className={styles.login}>
          <MdOutlinePassword />
        </span>
      ) : type === 'ssh' ? (
        <span className={styles.ssh}>
          <HiTerminal />
        </span>
      ) : type === 'server' ? (
        <span className={styles.server}>
          <FaServer />
        </span>
      ) : type === 'site' ? (
        <span className={styles.site}>
          <CgWebsite />
        </span>
      ) : type === 'ftp' ? (
        <span className={styles.site}>
          <TbCloudDataConnection />
        </span>
      ) : (
        <FcSafe />
      )}
    </div>
  );
}
