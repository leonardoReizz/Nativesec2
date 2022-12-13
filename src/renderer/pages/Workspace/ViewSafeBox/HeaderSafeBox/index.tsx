/* eslint-disable react/jsx-no-bind */
import { useContext, useState, useCallback } from 'react';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { GiPadlockOpen } from 'react-icons/gi';

import { SiKubernetes } from 'react-icons/si';
import { CgWebsite } from 'react-icons/cg';
import { MdOutlineAlternateEmail, MdOutlinePassword } from 'react-icons/md';
import { FcSafe, FcSimCardChip } from 'react-icons/fc';
import { HiTerminal } from 'react-icons/hi';
import { FaServer, FaMoneyCheckAlt } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { TbLicense, TbCloudDataConnection } from 'react-icons/tb';
import { RiEditFill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import { Input } from 'renderer/components/Inputs/Input';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import styles from './styles.module.sass';
import { FormModeType } from '..';
import { VerifySafetyPhraseModal } from 'renderer/components/Modals/VerifySafetyPhraseModal';

interface SafeBoxProps {
  currentSafeBox: ISafeBox | undefined;
  formikIndex: number;
  changeFormMode: (mode: FormModeType) => void;
  formMode: FormModeType;
}

export function HeaderSafeBox({
  currentSafeBox,
  formikIndex,
  changeFormMode,
  formMode,
}: SafeBoxProps) {
  const { theme } = useContext(ThemeContext);
  const [verifySafetyPhraseIsOpen, setVerifySafetyPhraseIsOpen] = useState<boolean>(false);
  function handleFormMode(mode: FormModeType) {
    changeFormMode(mode);
  }

  const handleCloseVerifySafetyPhraseModal = useCallback(() => {
    setVerifySafetyPhraseIsOpen(true);
  }, []);

  const handleOpenVerifySafetyPhraseModal = useCallback(() => {
    setVerifySafetyPhraseIsOpen(false);
  }, []);

  function handleEdit(isVerified: boolean) {
    if (isVerified) {
      changeFormMode('edit');
      handleOpenVerifySafetyPhraseModal();
    }
  }

  return (
    <>
      <VerifySafetyPhraseModal
        isOpen={verifySafetyPhraseIsOpen}
        onRequestClose={handleOpenVerifySafetyPhraseModal}
        title="Confirme sua frase secreta"
        verifySafetyPhrase={handleEdit}
      />
      <header className={`${theme === 'dark' ? styles.dark : styles.light}`}>
        {formMode === 'view' || formMode === 'edit' ? (
          <>
            <div className={styles.actions}>
              <button type="button">
                <GiPadlockOpen />
                <span>Descriptografar</span>
              </button>
              {/* <button>
                <GiPadlock />
              </button> */}
              <button type="button">
                <AiFillDelete />
                <span>Excluir</span>
              </button>
              <button
                type="button"
                onClick={handleCloseVerifySafetyPhraseModal}
              >
                <RiEditFill />
                <span>Editar</span>
              </button>
            </div>
            {formMode === 'view' ? (
              <div className={styles.title}>
                {currentSafeBox?.tipo === 'bankAccount' ? (
                  <span className={styles.bankAccount}>
                    <FaMoneyCheckAlt />
                  </span>
                ) : currentSafeBox?.tipo === 'annotation' ? (
                  <span className={styles.annotation}>
                    <IoDocumentText />
                  </span>
                ) : currentSafeBox?.tipo === 'creditCard' ? (
                  <FcSimCardChip />
                ) : currentSafeBox?.tipo === 'email' ? (
                  <span className={styles.email}>
                    <MdOutlineAlternateEmail />
                  </span>
                ) : currentSafeBox?.tipo === 'kubeconfig' ? (
                  <span className={styles.kubeconfig}>
                    <SiKubernetes />
                  </span>
                ) : currentSafeBox?.tipo === 'softwareLicense' ? (
                  <span className={styles.softwareLicense}>
                    <TbLicense />
                  </span>
                ) : currentSafeBox?.tipo === 'login' ? (
                  <span className={styles.login}>
                    <MdOutlinePassword />
                  </span>
                ) : currentSafeBox?.tipo === 'ssh' ? (
                  <span className={styles.ssh}>
                    <HiTerminal />
                  </span>
                ) : currentSafeBox?.tipo === 'server' ? (
                  <span className={styles.server}>
                    <FaServer />
                  </span>
                ) : currentSafeBox?.tipo === 'site' ? (
                  <span className={styles.site}>
                    <CgWebsite />
                  </span>
                ) : currentSafeBox?.tipo === 'ftp' ? (
                  <span className={styles.site}>
                    <TbCloudDataConnection />
                  </span>
                ) : (
                  <FcSafe />
                )}
                <div className={styles.description}>
                  <h3>{currentSafeBox?.nome}</h3>
                  <p>{currentSafeBox?.descricao}</p>
                </div>
              </div>
            ) : (
              ''
            )}
          </>
        ) : (
          <Input />
        )}
      </header>
    </>
  );
}
