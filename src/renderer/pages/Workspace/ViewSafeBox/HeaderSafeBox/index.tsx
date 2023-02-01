/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
import { useContext, useState, useCallback } from 'react';
import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';
import { BsCheck2 } from 'react-icons/bs';

import { RiEditFill } from 'react-icons/ri';
import { AiFillDelete } from 'react-icons/ai';
import { Input } from 'renderer/components/Inputs/Input';
import { VerifySafetyPhraseModal } from 'renderer/components/Modals/VerifySafetyPhraseModal';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { SafeBoxIcon, SafeBoxIconType } from 'renderer/components/SafeBoxIcon';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { FormikContextType } from 'formik';
import { IFormikItem } from 'renderer/contexts/CreateSafeBox/types';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import formik from '../../../../utils/Formik/formik';
import styles from './styles.module.sass';

export function HeaderSafeBox() {
  const { theme } = useUserConfig();
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const { formikIndex, changeFormikIndex } = useContext(CreateSafeBoxContext);
  const [verifySafetyPhraseType, setVerifySafetyPhraseType] = useState('');
  const { currentOrganization } = useContext(OrganizationsContext);
  const [verifySafetyPhraseIsOpen, setVerifySafetyPhraseIsOpen] =
    useState<boolean>(false);
  const [verifyNameModalIsOpen, setVerifyNameModalIsOpen] =
    useState<boolean>(false);
  const {
    deleteSafeBox,
    submitSafeBox,
    formikProps,
    decrypt,
    usersAdmin,
    usersParticipant,
    changeSafeBoxMode,
    safeBoxMode,
  } = useSafeBox();

  const handleCloseVerifySafetyPhraseModal = useCallback(() => {
    setVerifySafetyPhraseIsOpen(false);
  }, []);

  function handleOpenVerifySafetyPhraseModal() {
    setVerifySafetyPhraseIsOpen(true);
  }

  function handleOpenVerifyNameModal() {
    setVerifyNameModalIsOpen(true);
  }

  const handleCloseVerifyNameModal = useCallback(() => {
    setVerifyNameModalIsOpen(false);
  }, []);

  function verify(isVerified: boolean) {
    if (isVerified) {
      if (verifySafetyPhraseType === 'decryptSafeBox') {
        changeSafeBoxMode('decrypted');
        decrypt();
      } else {
        changeSafeBoxMode('edit');
        decrypt();
      }
      handleCloseVerifySafetyPhraseModal();
    }
  }

  function handleDiscart() {
    changeSafeBoxMode('view');
  }

  function handleSave() {
    if (currentOrganization) {
      submitSafeBox({
        formikProps: formikProps as unknown as FormikContextType<IFormikItem[]>,
        formikIndex,
        currentOrganizationId: currentOrganization._id,
        usersAdmin,
        usersParticipant,
      });
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

  function handleDecrypt(type: string) {
    setVerifySafetyPhraseType(type);
    handleOpenVerifySafetyPhraseModal();
  }

  function handleCrypt() {
    const myValues: IFormikItem[] = formik[formikIndex].item;
    myValues.forEach((item, index) => {
      if (item[`${item.name}`].startsWith('***')) {
        formikProps.setFieldValue(
          `${index}.${item.name}`,
          '******************'
        );
      }
    });

    changeSafeBoxMode('view');
  }

  return (
    <>
      <VerifySafetyPhraseModal
        isOpen={verifySafetyPhraseIsOpen}
        onRequestClose={handleCloseVerifySafetyPhraseModal}
        title="Confirme sua frase secreta"
        callback={verify}
      />

      <VerifyNameModal
        isOpen={verifyNameModalIsOpen}
        onRequestClose={handleCloseVerifyNameModal}
        title="Tem certeza que deseja excluir"
        inputText="Nome do cofre"
        nameToVerify={currentSafeBox?.nome}
        callback={handleDeleteSafeBox}
      />

      <header className={`${theme === 'dark' ? styles.dark : styles.light}`}>
        <>
          <div className={styles.actions}>
            {safeBoxMode === 'view' && (
              <button
                type="button"
                onClick={() => handleDecrypt('decryptSafeBox')}
              >
                <GiPadlockOpen />
                <span>Descriptografar</span>
              </button>
            )}
            {safeBoxMode === 'decrypted' && (
              <button type="button" onClick={() => handleCrypt()}>
                <GiPadlock />
                <span>Criptografar</span>
              </button>
            )}
            {safeBoxMode === 'view' && (
              <>
                <button
                  type="button"
                  onClick={handleOpenVerifySafetyPhraseModal}
                >
                  <RiEditFill />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenVerifyNameModal}
                  className={styles.red}
                >
                  <AiFillDelete />
                  <span>Excluir</span>
                </button>
              </>
            )}
            {(safeBoxMode === 'edit' || safeBoxMode === 'create') && (
              <>
                <button type="button" onClick={handleSave}>
                  <BsCheck2 />
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={handleDiscart}
                  className={styles.red}
                >
                  <AiFillDelete />
                  Descartar
                </button>
              </>
            )}
          </div>
          {(safeBoxMode === 'view' || safeBoxMode === 'decrypted') && (
            <div className={styles.title}>
              <SafeBoxIcon type={currentSafeBox?.tipo as SafeBoxIconType} />
              <div className={styles.description}>
                <h3>{currentSafeBox?.nome}</h3>
                <p>{currentSafeBox?.descricao}</p>
              </div>
            </div>
          )}
        </>
        {(safeBoxMode === 'edit' || safeBoxMode === 'create') && (
          <>
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
