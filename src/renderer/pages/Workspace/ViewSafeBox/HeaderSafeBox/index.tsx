/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
import { useContext, useState, useCallback } from 'react';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { GiPadlockOpen } from 'react-icons/gi';

import { RiEditFill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import { Input } from 'renderer/components/Inputs/Input';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { VerifySafetyPhraseModal } from 'renderer/components/Modals/VerifySafetyPhraseModal';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import {
  ModeType,
  SafeBoxModeContext,
} from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import { SafeBoxIcon, SafeBoxIconType } from 'renderer/components/SafeBoxIcon';
import formik from '../formik';
import styles from './styles.module.sass';

interface SafeBoxProps {
  currentSafeBox: ISafeBox | undefined;
  formikIndex: number;
  changeFormikIndex: (index: number) => void;
}

export function HeaderSafeBox({
  currentSafeBox,
  formikIndex,
  changeFormikIndex,
}: SafeBoxProps) {
  const { theme } = useContext(ThemeContext);
  const { safeBoxMode, changeSafeBoxMode } = useContext(SafeBoxModeContext);
  const [verifySafetyPhraseIsOpen, setVerifySafetyPhraseIsOpen] =
    useState<boolean>(false);
  const [verifyNameModalIsOpen, setVerifyNameModalIsOpen] =
    useState<boolean>(false);

  function handleFormMode(mode: ModeType) {
    changeSafeBoxMode(mode);
  }

  const handleCloseVerifySafetyPhraseModal = useCallback(() => {
    setVerifySafetyPhraseIsOpen(false);
  }, []);

  function handleOpenVerifySafetyPhraseModal() {
    setVerifySafetyPhraseIsOpen(true);
  }

  function handleOpenVerifyNameModal() {
    setVerifyNameModalIsOpen(true);
  }

  const handleCLoseVerifyNameModal = useCallback(() => {
    setVerifyNameModalIsOpen(false);
  }, []);

  function handleEdit(isVerified: boolean) {
    if (isVerified) {
      changeSafeBoxMode('edit');
      handleCloseVerifySafetyPhraseModal();
    }
  }

  function deleteSafeBox(isVerified: boolean) {
    if (isVerified) {
      toast.success('Cofre deletado', {
        ...toastOptions,
        toastId: 'deletedSafeBox',
      });
    }
  }

  function handleSelectOptionToCreateSafeBox(index: number) {
    changeFormikIndex(index);
  }

  return (
    <>
      <VerifySafetyPhraseModal
        isOpen={verifySafetyPhraseIsOpen}
        onRequestClose={handleCloseVerifySafetyPhraseModal}
        title="Confirme sua frase secreta"
        verifySafetyPhrase={handleEdit}
      />

      <VerifyNameModal
        isOpen={verifyNameModalIsOpen}
        onRequestClose={handleCLoseVerifyNameModal}
        title="Tem certeza que deseja excluir este cofre"
        inputText="Nome do cofre"
        nameToVerify={currentSafeBox?.nome}
        verifyName={deleteSafeBox}
      />
      <header className={`${theme === 'dark' ? styles.dark : styles.light}`}>
        {safeBoxMode === 'view' || safeBoxMode === 'edit' ? (
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
              <button type="button" onClick={handleOpenVerifySafetyPhraseModal}>
                <RiEditFill />
                <span>Editar</span>
              </button>
            </div>
            {safeBoxMode === 'view' ? (
              <div className={styles.title}>
                <SafeBoxIcon type={currentSafeBox?.tipo as SafeBoxIconType} />
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
          <>
            <h2>Novo Cofre</h2>
            <div className={styles.dropdown}>
              <SafeBoxIcon type={formik[formikIndex].type as SafeBoxIconType} />
              <div className={styles.input}>
                <Input
                  type="text"
                  className={styles.textBox}
                  readOnly
                  text="Tipo"
                  value={formik[formikIndex].name}
                  disabled={currentSafeBox !== undefined}
                />
              </div>
              <div className={styles.option}>
                {formik.map((item: any, index) => (
                  <div
                    onClick={() => handleSelectOptionToCreateSafeBox(index)}
                    key={item.value}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
