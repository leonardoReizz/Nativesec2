import { Button } from '@/renderer/components/Buttons/Button';
import { SafeBoxInfo } from '@/renderer/components/SafeBox';
import { useSafeBoxGroup } from '@/renderer/hooks/useSafeBoxGroup/useSafeBoxGroup';
import { BsFillTrashFill } from 'react-icons/bs';
import * as ContextMenu from '@radix-ui/react-context-menu';
import { useCallback } from 'react';
import { VerifyNameModal } from '@/renderer/components/Modals/VerifyNameModal';
import { Header } from './components/Header';
import styles from './styles.module.sass';
import { ContextMenuComponent } from './components/ContextMenu';

export function SafeBoxGroup() {
  const {
    safeBoxGroup,
    currentSafeBoxGroup,
    groupSafeBoxes,
    changeSelectedSafeBox,
    selectedSafeBox,
    navigate,
    theme,
    currentOrganization,
    isOpenVerifyNameModal,
    closeVerifyNameModal,
    openVerifyNameModal,
    deleteSafeBoxCallback,
    viewSafeBox,
  } = useSafeBoxGroup();

  const editSafeBox = useCallback(() => {
    if (selectedSafeBox) {
      navigate(`/workspace/${selectedSafeBox?._id}/edit`);
    }
  }, [selectedSafeBox]);

  return (
    <>
      {currentSafeBoxGroup && (
        <VerifyNameModal
          title="Deseja excluir"
          inputText="Nome do cofre"
          callback={deleteSafeBoxCallback}
          nameToVerify={currentSafeBoxGroup?.nome}
          isOpen={isOpenVerifyNameModal}
          onRequestClose={closeVerifyNameModal}
        />
      )}
      <div className={styles.safeBoxGroupContainer}>
        {currentSafeBoxGroup && (
          <Header safeBoxGroup={currentSafeBoxGroup} theme={theme} />
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
                    />
                  </div>
                </ContextMenu.Trigger>
                <ContextMenuComponent
                  viewSafeBox={viewSafeBox}
                  openVerifyNameModal={openVerifyNameModal}
                />
              </ContextMenu.Root>
            );
          })}
        </main>
      </div>
    </>
  );
}
