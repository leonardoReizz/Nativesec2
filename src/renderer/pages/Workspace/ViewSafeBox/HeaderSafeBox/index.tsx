/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
import { useContext, useState, useCallback } from 'react';
import { GiPadlockOpen } from 'react-icons/gi';
import { BsCheck2 } from 'react-icons/bs';

import { RiEditFill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import { Input } from 'renderer/components/Inputs/Input';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { VerifySafetyPhraseModal } from 'renderer/components/Modals/VerifySafetyPhraseModal';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import { SafeBoxIcon, SafeBoxIconType } from 'renderer/components/SafeBoxIcon';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import formik from '../../../../utils/Formik/formik';
import styles from './styles.module.sass';

export function HeaderSafeBox() {
  const { theme } = useContext(ThemeContext);
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const { formikIndex, changeFormikIndex, handleSubmit } =
    useContext(CreateSafeBoxContext);
  const { currentOrganization } = useContext(OrganizationsContext);
  const { safeBoxMode, changeSafeBoxMode } = useContext(SafeBoxModeContext);
  const [verifySafetyPhraseIsOpen, setVerifySafetyPhraseIsOpen] =
    useState<boolean>(false);
  const [verifyNameModalIsOpen, setVerifyNameModalIsOpen] =
    useState<boolean>(false);
  const { deleteSafeBox } = useSafeBox();

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

  const handleDeleteSafeBox = useCallback(
    (isVerified: boolean) => {
      if (isVerified && currentOrganization && currentSafeBox) {
        deleteSafeBox({
          organizationId: currentOrganization?._id,
          safeBoxId: currentSafeBox?._id,
        });
      }
    },
    [currentOrganization, currentSafeBox, deleteSafeBox]
  );

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
        title="Tem certeza que deseja excluir"
        inputText="Nome do cofre"
        nameToVerify={currentSafeBox?.nome}
        verifyName={handleDeleteSafeBox}
      />

      <header className={`${theme === 'dark' ? styles.dark : styles.light}`}>
        {safeBoxMode === 'view' && (
          <>
            <div className={styles.actions}>
              <button type="button">
                <GiPadlockOpen />
                <span>Descriptografar</span>
              </button>
              {/* <button>
                <GiPadlock />
              </button> */}
              <button type="button" onClick={handleOpenVerifyNameModal}>
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
        )}
        {(safeBoxMode === 'edit' || safeBoxMode === 'create') && (
          <>
            <div className={styles.actions}>
              <button type="button" onClick={handleSubmit}>
                <BsCheck2 />
                Salvar
              </button>
              <button type="button">
                <AiFillDelete />
                Descartar
              </button>
            </div>
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
