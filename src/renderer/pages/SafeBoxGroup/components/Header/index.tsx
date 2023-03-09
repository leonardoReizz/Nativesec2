/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
import { useState, useCallback } from 'react';
import { ImMakeGroup } from 'react-icons/im';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { useSafeBox } from '@/renderer/hooks/useSafeBox/useSafeBox';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { VerifyNameModal } from '@/renderer/components/Modals/VerifyNameModal';
import { deleteSafeBoxGroupIPC } from '@/renderer/services/ipc/SafeBoxGroup';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { toast } from 'react-toastify';
import styles from './styles.module.sass';
import { Dropdown } from '../Dropdown/RadixDropDown';
import { AddSafeBoxModal } from '../AddSafeBoxModal';

interface HeaderProps {
  theme?: ThemeType;
  safeBoxGroup: ISafeBoxGroup;
}
export function Header({ theme = 'light', safeBoxGroup }: HeaderProps) {
  const [isOpenAddSafeBoxModal, setIsOpenAddSafeBoxModal] =
    useState<boolean>(false);
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);
  const { safeBoxMode, isSafeBoxParticipant } = useSafeBox();

  const handleOpenVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(true);
  }, []);

  function handleSave() {}

  function handleDiscart() {}

  function verify() {
    toast.loading('Salvando...', { ...toastOptions, toastId: 'deleteSafeBox' });
    deleteSafeBoxGroupIPC({
      safeBoxGroupId: safeBoxGroup._id,
      organizationId: safeBoxGroup.organizacao,
    });
    setIsOpenVerifyNameModal(false);
  }

  const closeVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(false);
  }, []);

  const onOpenChangeAddSafeBoxModal = useCallback((open: boolean) => {
    setIsOpenAddSafeBoxModal(open);
  }, []);

  const closeAddSafeBoxModal = useCallback(() => {
    setIsOpenAddSafeBoxModal(false);
  }, []);

  return (
    <>
      <Dialog.Root
        open={isOpenAddSafeBoxModal}
        onOpenChange={onOpenChangeAddSafeBoxModal}
      >
        <AddSafeBoxModal
          safeBoxGroup={safeBoxGroup}
          closeAddSafeBoxModal={closeAddSafeBoxModal}
        />
      </Dialog.Root>
      <VerifyNameModal
        nameToVerify={safeBoxGroup.nome}
        callback={verify}
        title="Tem certeza que seja excluir"
        inputText="Nome do Grupo de Cofres"
        onRequestClose={closeVerifyNameModal}
        isOpen={isOpenVerifyNameModal}
      />
      <header
        className={`${styles.header} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={styles.title}>
          <ImMakeGroup />
          <div className={styles.description}>
            <h2>{safeBoxGroup?.nome}</h2>
            <p>{safeBoxGroup?.descricao}</p>
          </div>
        </div>
        <div className={styles.action}>
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
              deleteSafeBoxGroup={handleOpenVerifyNameModal}
              theme={theme}
              onOpenChangeAddSafeBoxModal={onOpenChangeAddSafeBoxModal}
            />
          </DropdownMenu.Root>
        </div>
      </header>
    </>
  );
}
