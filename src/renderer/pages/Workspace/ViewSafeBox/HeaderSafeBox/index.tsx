/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
import { useContext, useState, useCallback, useEffect } from 'react';
import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';
import { BsCheck2 } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { Input } from 'renderer/components/Inputs/Input';
import { VerifySafetyPhraseModal } from 'renderer/components/Modals/VerifySafetyPhraseModal';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { SafeBoxIcon, SafeBoxIconType } from 'renderer/components/SafeBoxIcon';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { IFormikItem } from 'renderer/contexts/CreateSafeBox/types';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Button } from 'renderer/components/Buttons/Button';
import { useLoading } from 'renderer/hooks/useLoading';
import { FormikContextType } from 'formik';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { deleteSafeBox } from '@/renderer/services/ipc/SafeBox';
import { useSafeBox } from '@/renderer/hooks/useSafeBox/useSafeBox';
import {
  ISafeBoxGroup,
  SafeBoxGroupContext,
} from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { updateSafeBoxGroupIPC } from '@/renderer/services/ipc/SafeBoxGroup';
import { toast } from 'react-toastify';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { useLocation, useParams } from 'react-router-dom';
import formik from '../../../../utils/Formik/formik';
import styles from './styles.module.sass';
import { Dropdown } from '../Dropdown';
import { SharingModal } from '../SharingModal';

export function HeaderSafeBox() {
  const { theme } = useUserConfig();
  const { safeBoxGroup } = useContext(SafeBoxGroupContext);
  const { currentSafeBox, changeSafeBoxesIsLoading } =
    useContext(SafeBoxesContext);
  const { formikIndex, changeFormikIndex } = useContext(CreateSafeBoxContext);
  const [verifySafetyPhraseType, setVerifySafetyPhraseType] = useState('');
  const [isOpenSharingModal, setIsOpenSharingModal] = useState<boolean>(false);
  const { currentOrganization } = useContext(OrganizationsContext);
  const [verifySafetyPhraseIsOpen, setVerifySafetyPhraseIsOpen] =
    useState<boolean>(false);
  const [verifyNameModalIsOpen, setVerifyNameModalIsOpen] =
    useState<boolean>(false);
  const {
    submitSafeBox,
    formikProps,
    decrypt,
    usersAdmin,
    usersParticipant,
    changeSafeBoxMode,
    safeBoxMode,
    isSafeBoxParticipant,
  } = useSafeBox();
  const { mode } = useParams();
  const location = useLocation();

  const participantGroups = safeBoxGroup
    .map((group) => {
      const safeboxes = JSON.parse(group.cofres);
      const filter = safeboxes.filter(
        (safeboxId: string) => safeboxId === currentSafeBox?._id
      );
      if (filter[0]) {
        return group;
      }

      return undefined;
    })
    .filter((group) => group !== undefined);

  const { loading, updateLoading } = useLoading();

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

  useEffect(() => {
    if (mode === 'edit') {
      setVerifySafetyPhraseIsOpen(true);
    } else if (mode === 'decrypt') {
      setVerifySafetyPhraseType('decryptSafeBox');
      handleOpenVerifySafetyPhraseModal();
    } else if (mode === 'delete') {
      setVerifyNameModalIsOpen(true);
    }

    console.log(mode, ' mode');
  }, [location]);

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
        updateLoading(true);
        changeSafeBoxesIsLoading(true);
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

  const openSharingModal = useCallback((open: boolean) => {
    setIsOpenSharingModal(open);
  }, []);

  const addSafeBoxGroup = useCallback(
    (group: ISafeBoxGroup) => {
      if (currentSafeBox) {
        toast.loading('Salvando...', {
          ...toastOptions,
          toastId: 'updateSafeBoxGroup',
        });
        updateSafeBoxGroupIPC({
          id: group._id,
          description: group.descricao,
          name: group.nome,
          organization: group.organizacao,
          safeboxes: [
            ...(JSON.parse(group.cofres) as string[]),
            currentSafeBox?._id,
          ],
        });
      }
    },
    [currentSafeBox]
  );

  const removeSafeBoxFromGroup = useCallback(
    (group: ISafeBoxGroup) => {
      if (currentSafeBox) {
        toast.loading('Salvando...', {
          ...toastOptions,
          toastId: 'updateSafeBoxGroup',
        });
        const safeBoxes = JSON.parse(group.cofres) as string[];
        const filterSafeBoxes = safeBoxes.filter(
          (safebox) => safebox !== currentSafeBox?._id
        );

        updateSafeBoxGroupIPC({
          id: group._id,
          description: group.descricao,
          name: group.nome,
          organization: group.organizacao,
          safeboxes: filterSafeBoxes,
        });
      }
    },
    [currentSafeBox, safeBoxGroup]
  );

  return (
    <>
      {currentSafeBox && (
        <Dialog.Root open={isOpenSharingModal} onOpenChange={openSharingModal}>
          <Dialog.Trigger />
          <SharingModal safeBox={currentSafeBox} />
        </Dialog.Root>
      )}
      <VerifySafetyPhraseModal
        isOpen={verifySafetyPhraseIsOpen}
        onRequestClose={handleCloseVerifySafetyPhraseModal}
        title="Confirme sua frase secreta"
        callback={verify}
        theme={theme}
      />

      <VerifyNameModal
        isOpen={verifyNameModalIsOpen}
        onRequestClose={handleCloseVerifyNameModal}
        title="Tem certeza que deseja excluir"
        inputText="Nome do cofre"
        nameToVerify={currentSafeBox?.nome}
        callback={handleDeleteSafeBox}
        isLoading={loading}
      />
      <header className={`${theme === 'dark' ? styles.dark : styles.light}`}>
        {/* <div className={styles.actions}>
            {safeBoxMode === 'view' && (
              <Button
                text="Descriptografar"
                onClick={() => handleDecrypt('decryptSafeBox')}
                theme={theme}
                Icon={<GiPadlockOpen />}
              />
            )}
            {safeBoxMode === 'decrypted' && (
              <Button
                text="Criptografar"
                theme={theme}
                onClick={() => handleCrypt()}
                Icon={<GiPadlock />}
              />
            )}
            {(safeBoxMode === 'view' || safeBoxMode === 'decrypted') && (
              <>
                <Button
                  text="Editar"
                  theme={theme}
                  onClick={() => handleDecrypt('edit')}
                  Icon={<RiEditFill />}
                  disabled={isSafeBoxParticipant}
                />
                <Button
                  text="Excluir"
                  onClick={handleOpenVerifyNameModal}
                  className={styles.red}
                  theme={theme}
                  Icon={<AiFillDelete />}
                  disabled={isSafeBoxParticipant}
                />
              </>
            )}
          </div> */}
        {safeBoxMode === 'create' && (
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
                  theme={theme}
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

        {safeBoxMode !== 'create' && (
          <div className={styles.title}>
            <SafeBoxIcon type={currentSafeBox?.tipo as SafeBoxIconType} />
            <div className={styles.description}>
              <h3>{currentSafeBox?.nome}</h3>
              <p>{currentSafeBox?.descricao}</p>
            </div>
          </div>
        )}

        <div className={styles.action}>
          {safeBoxMode === 'view' && (
            <Button
              text="Descriptografar"
              onClick={() => handleDecrypt('decryptSafeBox')}
              theme={theme}
              Icon={<GiPadlockOpen />}
            />
          )}
          {safeBoxMode === 'decrypted' && (
            <Button
              text="Criptografar"
              theme={theme}
              onClick={() => handleCrypt()}
              Icon={<GiPadlock />}
            />
          )}
          {(safeBoxMode === 'edit' || safeBoxMode === 'create') && (
            <div className={styles.createSafeBoxActions}>
              <Button
                text="Salvar"
                Icon={<BsCheck2 />}
                onClick={handleSave}
                theme={theme}
              />
              <Button
                text="Descartar"
                Icon={<AiFillDelete />}
                onClick={handleDiscart}
                className={styles.red}
                theme={theme}
              />
            </div>
          )}
          {safeBoxMode !== 'edit' && safeBoxMode !== 'create' && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className={styles.iconButton}
                  aria-label="Customise options"
                >
                  <BiDotsVerticalRounded />
                </button>
              </DropdownMenu.Trigger>
              <Dropdown
                editSafeBox={() => handleDecrypt('edit')}
                deleteSafeBox={handleOpenVerifyNameModal}
                deleteSafeBoxGroup={handleOpenVerifyNameModal}
                openSharingModal={() => setIsOpenSharingModal(true)}
                theme={theme}
                groups={safeBoxGroup}
                addSafeBoxGroup={addSafeBoxGroup}
                participantGroups={participantGroups as ISafeBoxGroup[]}
                removeSafeBoxFromGroup={removeSafeBoxFromGroup}
              />
            </DropdownMenu.Root>
          )}
        </div>
      </header>
    </>
  );
}
