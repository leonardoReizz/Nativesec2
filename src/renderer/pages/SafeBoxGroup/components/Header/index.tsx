/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
import { useState, useCallback } from 'react';
import { ImMakeGroup } from 'react-icons/im';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { VerifyNameModal } from '@/renderer/components/Modals/VerifyNameModal';
import { deleteSafeBoxGroupIPC } from '@/renderer/services/ipc/SafeBoxGroup';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { toast } from 'react-toastify';
import { CreateSafeBoxGroupModal } from '@/renderer/components/NewSidebar/components/CreateSafeBoxGroupModal';
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
  const [isOpenEditSafeBoxGroupModal, setIsOpenEditSafeBoxGroupModal] =
    useState<boolean>(false);

  const onOpenChangeEditSafeBoxGroupModal = useCallback((open: boolean) => {
    setIsOpenEditSafeBoxGroupModal(open);
  }, []);

  const handleOpenVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(true);
  }, []);

  function verify() {
    toast.loading('Salvando...', {
      ...toastOptions,
      toastId: 'deleteSafeBoxGroup',
    });
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
        onOpenChange={onOpenChangeEditSafeBoxGroupModal}
        open={isOpenEditSafeBoxGroupModal}
      >
        <CreateSafeBoxGroupModal
          open={isOpenEditSafeBoxGroupModal}
          closeCreateSafeBoxGroupModal={() =>
            onOpenChangeEditSafeBoxGroupModal(false)
          }
          edit={{ safeBoxGroup }}
          title="Editar Grupo de Cofres"
          theme={theme}
        />
      </Dialog.Root>
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
              onOpenChangeEditSafeBoxGroupModal={
                onOpenChangeEditSafeBoxGroupModal
              }
            />
          </DropdownMenu.Root>
        </div>
      </header>
    </>
  );
}
