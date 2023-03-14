import { Button } from '@/renderer/components/Buttons/Button';
import { SafeBoxInfo } from '@/renderer/components/SafeBox';
import { useSafeBoxGroup } from '@/renderer/hooks/useSafeBoxGroup/useSafeBoxGroup';
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
    selectedSafeBox,
    theme,
    isOpenVerifyNameModal,
    closeVerifyNameModal,
    openVerifyNameModal,
    viewSafeBox,
    removeSafeBoxGroup,
    loading,
    handleRemoveSafeBoxGroup,
  } = useSafeBoxGroup();

  return (
    <>
      {currentSafeBoxGroup && (
        <VerifyNameModal
          title="Deseja remover"
          inputText="Nome do cofre"
          callback={removeSafeBoxGroup}
          nameToVerify={selectedSafeBox?.nome}
          isOpen={isOpenVerifyNameModal}
          onRequestClose={closeVerifyNameModal}
          isLoading={loading}
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
                      onClick={() => handleRemoveSafeBoxGroup(safebox)}
                    />
                  </div>
                </ContextMenu.Trigger>
                <ContextMenuComponent
                  viewSafeBox={viewSafeBox}
                  openVerifyNameModal={openVerifyNameModal}
                  theme={theme}
                />
              </ContextMenu.Root>
            );
          })}
        </main>
      </div>
    </>
  );
}
