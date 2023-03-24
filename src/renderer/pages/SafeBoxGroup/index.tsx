import { Button } from '@/renderer/components/Buttons/Button';
import { SafeBoxInfo } from '@/renderer/components/SafeBox';
import { useSafeBoxGroupComponent } from '@/renderer/hooks/useSafeBoxGroupComponent/useSafeBoxGroupComponent';
import {
  BsFillEyeFill,
  BsFillTrashFill,
  BsShieldLockFill,
} from 'react-icons/bs';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { VerifyNameModal } from '@/renderer/components/Modals/VerifyNameModal';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TbEdit } from 'react-icons/tb';
import {
  IRadixDropdownOptions,
  RadixDropdown,
} from '@/renderer/components/RadixDropdown';
import { useCallback, useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { ISafeBox } from '@/renderer/contexts/SafeBoxesContext/types';
import { Header } from './components/Header';
import styles from './styles.module.sass';
import { ContextMenuComponent } from './components/ContextMenu';

export function SafeBoxGroup() {
  const {
    currentSafeBoxGroup,
    groupSafeBoxes,
    changeSelectedSafeBox,
    theme,
    isOpenVerifyNameModal,
    closeVerifyNameModal,
    openVerifyNameModal,
    viewSafeBox,
    removeSafeBoxGroup,
    loading,
    handleRemoveSafeBoxGroup,
    decryptSafeBox,
    onOpenChangeEditSafeBoxGroupModal,
    isOpenChangeEditSafeBoxGroupModal,
  } = useSafeBoxGroupComponent();

  const options: IRadixDropdownOptions[] = [
    {
      id: '1',
      label: 'Permissao',
      items: [
        {
          function: viewSafeBox,
          id: '1',
          text: 'Visualiazar',
          Icon: BsFillEyeFill,
        },
        {
          function: decryptSafeBox,
          id: '2',
          text: 'Descriptografar',
          Icon: BsShieldLockFill,
        },
      ],
    },
    {
      id: '3',
      label: 'Editar',
      items: [
        {
          function: () => onOpenChangeEditSafeBoxGroupModal(true),
          id: '1',
          text: 'Editar Cofre',
          Icon: TbEdit,
        },
      ],
    },
    {
      id: '3',
      label: 'Remover',
      items: [
        {
          function: openVerifyNameModal,
          id: '1',
          text: 'Remover Cofre',
          Icon: BsFillTrashFill,
        },
      ],
    },
  ];

  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);

  const onOpenChangeIsOpenDropdown = useCallback((open: boolean) => {
    setIsOpenDropdown(open);
  }, []);

  const handleDropDown = useCallback((safeBox: ISafeBox) => {
    changeSelectedSafeBox(safeBox);
    setIsOpenDropdown(true);
  }, []);
  return (
    <>
      {currentSafeBoxGroup && (
        <VerifyNameModal
          title="Deseja remover"
          inputText="Nome do grupo"
          callback={removeSafeBoxGroup}
          nameToVerify={currentSafeBoxGroup?.nome}
          isOpen={isOpenVerifyNameModal}
          onRequestClose={closeVerifyNameModal}
          isLoading={loading}
        />
      )}
      <div
        className={`${styles.safeBoxGroupContainer} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        {currentSafeBoxGroup && (
          <Header
            safeBoxGroup={currentSafeBoxGroup}
            theme={theme}
            onOpenChangeEditSafeBoxGroupModal={
              onOpenChangeEditSafeBoxGroupModal
            }
            isOpenEditSafeBoxGroupModal={isOpenChangeEditSafeBoxGroupModal}
          />
        )}
        <main>
          {groupSafeBoxes.map((safebox) => {
            return (
              <ContextMenu.Root>
                <ContextMenu.Trigger>
                  <div
                    className={styles.safeBox}
                    onContextMenu={() => changeSelectedSafeBox(safebox)}
                  >
                    <SafeBoxInfo safeBox={safebox} />
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button
                          type="button"
                          className={styles.button}
                          onClick={() => changeSelectedSafeBox(safebox)}
                        >
                          <BiDotsVerticalRounded />
                        </button>
                      </DropdownMenu.Trigger>{' '}
                      <RadixDropdown theme={theme} options={options} />
                    </DropdownMenu.Root>
                  </div>
                </ContextMenu.Trigger>
                <ContextMenuComponent
                  viewSafeBox={viewSafeBox}
                  openVerifyNameModal={openVerifyNameModal}
                  theme={theme}
                  editSafeBox={() => onOpenChangeEditSafeBoxGroupModal(true)}
                  decryptSafeBox={decryptSafeBox}
                />
              </ContextMenu.Root>
            );
          })}
        </main>
      </div>
    </>
  );
}
