import { useCallback, useEffect, useState, useContext } from 'react';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Button } from 'renderer/components/Buttons/Button';
import { IoMdAdd } from 'react-icons/io';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { CreateSafeBoxContext } from '@/renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { Form } from './Form';
import Users from './Users';
import styles from './styles.module.sass';
import { AddParticipantModal } from './AddParticipantModal';

export function MainSafeBox() {
  const [tab, setTab] = useState<'form' | 'users'>('form');

  const [isOpenAddParticipantModal, setIsOpenParticipantModal] =
    useState<boolean>(false);

  const { updateUsersSelected, usersSelected } =
    useContext(CreateSafeBoxContext);

  const { theme } = useUserConfig();

  const {
    addSafeBoxUsers,
    currentSafeBox,
    safeBoxMode,
    changeUsersAdmin,
    changeUsersParticipant,
    isSafeBoxParticipant,
  } = useSafeBox();

  function handleTabForm() {
    setTab('form');
  }
  function handleTabUsers() {
    setTab('users');
  }

  const closeModal = useCallback(() => {
    setIsOpenParticipantModal(false);
  }, []);

  function inviteUsers(usersAdmin: string[], usersParticipant: string[]) {
    if (currentSafeBox) {
      addSafeBoxUsers({
        _id: currentSafeBox._id,
        anexos: JSON.parse(currentSafeBox.anexos),
        conteudo: JSON.parse(currentSafeBox.conteudo),
        criptografia: 'rsa',
        descricao: currentSafeBox.descricao,
        nome: currentSafeBox.nome,
        organizacao: currentSafeBox.organizacao,
        tipo: currentSafeBox.tipo,
        usuarios_escrita: [
          ...JSON.parse(currentSafeBox.usuarios_escrita),
          ...usersAdmin,
        ],
        usuarios_escrita_deletado: JSON.parse(
          currentSafeBox.usuarios_escrita_deletado
        ),
        usuarios_leitura: [
          ...JSON.parse(currentSafeBox.usuarios_leitura),
          ...usersParticipant,
        ],
        usuarios_leitura_deletado: JSON.parse(
          currentSafeBox.usuarios_leitura_deletado
        ),
      });
      const currentUsers = usersSelected.map((user) => {
        return {
          ...user,
          added: false,
        };
      });
      updateUsersSelected(currentUsers);
    }
  }

  function addUsers(usersAdmin: string[], usersParticipant: string[]) {
    setIsOpenParticipantModal(false);
    changeUsersAdmin(usersAdmin);
    changeUsersParticipant(usersParticipant);
  }

  return (
    <>
      <AddParticipantModal
        isOpen={isOpenAddParticipantModal}
        onRequestClose={closeModal}
        callback={safeBoxMode === 'create' ? addUsers : inviteUsers}
        updateUsersSelected={updateUsersSelected}
        usersSelected={usersSelected}
      />
      <div
        className={`${styles.mainSafeBox} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <div className={styles.menu}>
          <button
            type="button"
            onClick={handleTabForm}
            className={`${tab === 'form' ? styles.selected : ''}`}
          >
            Cofre
          </button>
          <button
            type="button"
            onClick={handleTabUsers}
            className={`${tab === 'users' ? styles.selected : ''}`}
          >
            Compartilhado com
          </button>
          {tab === 'users' && (
            <Button
              type="button"
              className={styles.addParticipantButton}
              text="Compartilhar"
              Icon={<IoMdAdd />}
              theme={theme}
              onClick={() => setIsOpenParticipantModal(true)}
              disabled={isSafeBoxParticipant}
            />
          )}
        </div>
        <div
          className={`${styles.form} ${tab === 'form' ? styles.formOpen : ''}`}
        >
          <Form />
        </div>
        <div
          className={`${styles.form} ${
            tab === 'users' ? styles.usersOpen : ''
          }`}
        >
          <Users />
        </div>
        {/* {tab === 'form' ? <Form /> : <Users />} */}
      </div>
    </>
  );
}
