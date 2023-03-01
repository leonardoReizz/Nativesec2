/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */
import { useState, useCallback } from 'react';
import { ImMakeGroup } from 'react-icons/im';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { VerifyNameModal } from '@/renderer/components/Modals/VerifyNameModal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import styles from './styles.module.sass';
import { Dropdown } from '../Dropdown/RadixDropDown';

interface HeaderProps {
  theme?: ThemeType;
  safeBoxGroup: ISafeBoxGroup;
}
export function Header({ theme = 'light', safeBoxGroup }: HeaderProps) {
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);
  const { safeBoxMode, isSafeBoxParticipant } = useSafeBox();

  const handleOpenVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(true);
  }, []);

  function handleSave() {}

  function handleDiscart() {}

  function verify() {}

  const closeVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(false);
  }, []);

  return (
    <>
      <VerifyNameModal
        nameToVerify={safeBoxGroup.nome}
        callback={verify}
        title="Tem certeza que seja excluir"
        inputText="Nome do Grupo de Cofres"
        onRequestClose={closeVerifyNameModal}
        isOpen={isOpenVerifyNameModal}
      />
      <header className={`${theme === 'dark' ? styles.dark : styles.light}`}>
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
            <Dropdown deleteSafeBoxGroup={handleOpenVerifyNameModal} />
          </DropdownMenu.Root>
        </div>
      </header>
    </>
  );
}
