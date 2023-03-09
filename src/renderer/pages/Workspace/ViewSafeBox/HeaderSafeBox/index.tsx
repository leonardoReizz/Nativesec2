/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-bind */

import { GiPadlock, GiPadlockOpen } from 'react-icons/gi';
import { BsCheck2 } from 'react-icons/bs';
import { AiFillDelete } from 'react-icons/ai';
import { Input } from 'renderer/components/Inputs/Input';
import { VerifySafetyPhraseModal } from 'renderer/components/Modals/VerifySafetyPhraseModal';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { SafeBoxIcon, SafeBoxIconType } from 'renderer/components/SafeBoxIcon';

import { Button } from 'renderer/components/Buttons/Button';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { BiDotsVerticalRounded } from 'react-icons/bi';

import { ISafeBoxGroup } from '@/renderer/contexts/SafeBoxGroupContext/SafeBoxGroupContext';
import { useHeaderSafeBox } from '@/renderer/hooks/useHeaderSafeBox';
import formik from '../../../../utils/Formik/formik';
import styles from './styles.module.sass';
import { Dropdown } from '../Dropdown';
import { SharingModal } from '../SharingModal';

export function HeaderSafeBox() {
  const {
    currentSafeBox,
    isOpenSharingModal,
    openSharingModal,
    closeSharingModal,
    verifySafetyPhraseIsOpen,
    handleCloseVerifySafetyPhraseModal,
    verify,
    theme,
    verifyNameModalIsOpen,
    handleCloseVerifyNameModal,
    handleDeleteSafeBox,
    loading,
    safeBoxMode,
    formikIndex,
    handleSelectOptionToCreateSafeBox,
    handleDecrypt,
    handleCrypt,
    removeSafeBoxFromGroup,
    participantGroups,
    addSafeBoxGroup,
    safeBoxGroup,
    handleOpenVerifyNameModal,
    handleSave,
    handleDiscart,
    onOpenChangeSharingModal,
  } = useHeaderSafeBox();

  return (
    <>
      {currentSafeBox && (
        <Dialog.Root open={isOpenSharingModal} onOpenChange={openSharingModal}>
          <Dialog.Trigger />
          <SharingModal
            safeBox={currentSafeBox}
            closeSharingModal={closeSharingModal}
          />
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
  );
}
