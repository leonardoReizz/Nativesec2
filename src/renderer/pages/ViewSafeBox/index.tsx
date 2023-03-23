import { Button } from '@/renderer/components/Buttons/Button';
import { VerifyNameModal } from '@/renderer/components/Modals/VerifyNameModal';
import { VerifySafetyPhraseModal } from '@/renderer/components/Modals/VerifySafetyPhraseModal';
import { useViewSafeBoxComponent } from '@/renderer/hooks/useViewSafeBoxComponent/useViewSafeBoxComponent';
import * as Dialog from '@radix-ui/react-dialog';
import { AiFillDelete } from 'react-icons/ai';
import { BsCheck2 } from 'react-icons/bs';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import {
  SafeBoxIcon,
  SafeBoxIconType,
} from '@/renderer/components/SafeBoxIcon';
import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { MainSafeBox } from '../Workspace/ViewSafeBox/MainSafeBox';
import { SharingModal } from '../Workspace/ViewSafeBox/SharingModal';
import styles from './styles.module.sass';
import { Dropdown } from '../Workspace/ViewSafeBox/Dropdown';

export function ViewSafeBox() {
  const {
    formikProps,
    currentSafeBox,
    onOpenChangeSharingModal,
    isOpenVerifySafetyPhrase,
    isOpenSharingModal,
    isOpenVerifyNameModal,
    onOpenChangeVerifyNameModal,
    onOpenChangerifySafetyPhraseModal,
    theme,
    safeBoxMode,
    loading,
    changeSafeBoxMode,
    handleDeleteSafeBox,
    handleDecrypt,
    handleCrypt,
    removeSafeBoxFromGroup,
    addSafeBoxGroup,
    safeBoxGroup,
    participantGroups,
  } = useViewSafeBoxComponent();

  return (
    <div className={styles.viewSafeBoxContainer}>
      <>
        {currentSafeBox && (
          <Dialog.Root
            open={isOpenSharingModal}
            onOpenChange={onOpenChangeSharingModal}
          >
            <Dialog.Trigger />
            <SharingModal
              safeBox={currentSafeBox}
              closeSharingModal={() => onOpenChangeSharingModal(false)}
            />
          </Dialog.Root>
        )}
        <VerifySafetyPhraseModal
          isOpen={isOpenVerifySafetyPhrase}
          onRequestClose={() => onOpenChangerifySafetyPhraseModal(false)}
          title="Confirme sua frase secreta"
          callback={() => changeSafeBoxMode('edit')}
          theme={theme}
        />

        <VerifyNameModal
          isOpen={isOpenVerifyNameModal}
          onRequestClose={() => onOpenChangeVerifyNameModal(false)}
          title="Tem certeza que deseja excluir"
          inputText="Nome do cofre"
          nameToVerify={currentSafeBox?.nome}
          callback={handleDeleteSafeBox}
          isLoading={loading}
        />
        <header className={`${theme === 'dark' ? styles.dark : styles.light}`}>
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
            {safeBoxMode === 'edit' && (
              <div className={styles.createSafeBoxActions}>
                <Button
                  text="Salvar"
                  Icon={<BsCheck2 />}
                  onClick={formikProps.submitForm}
                  theme={theme}
                />
                <Button
                  text="Descartar"
                  Icon={<AiFillDelete />}
                  onClick={() => {}}
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
                  deleteSafeBox={() => onOpenChangeVerifyNameModal(true)}
                  deleteSafeBoxGroup={() => onOpenChangeVerifyNameModal(true)}
                  openSharingModal={() => onOpenChangeSharingModal(true)}
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
      <main>
        <MainSafeBox formikProps={formikProps} />
      </main>
    </div>
  );
}
