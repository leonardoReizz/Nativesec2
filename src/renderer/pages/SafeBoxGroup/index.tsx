import { Button } from '@/renderer/components/Buttons/Button';
import { SafeBoxInfo } from '@/renderer/components/SafeBox';
import { useSafeBoxGroupComponent } from '@/renderer/hooks/useSafeBoxGroupComponent/useSafeBoxGroupComponent';
import { BsFillTrashFill } from 'react-icons/bs';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { VerifyNameModal } from '@/renderer/components/Modals/VerifyNameModal';
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
      <div className={styles.safeBoxGroupContainer}>
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
                    <Button
                      className={styles.button}
                      Icon={<BsFillTrashFill />}
                      color="red"
                      onClick={() => handleRemoveSafeBoxGroup(safebox)}
                    />
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
