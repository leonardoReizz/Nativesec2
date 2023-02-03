import { useCallback, useState } from 'react';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Button } from 'renderer/components/Buttons/Button';
import { IoMdAdd } from 'react-icons/io';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { Form } from './Form';
import Users from './Users';
import styles from './styles.module.sass';
import { AddParticipantModal } from './AddParticipantModal';

export function MainSafeBox() {
  const [tab, setTab] = useState<'form' | 'users'>('form');
  const [isOpenAddParticipantModal, setIsOpenParticipantModal] =
    useState<boolean>(false);
  const { theme } = useUserConfig();
  const { addSafeBoxUsers, currentSafeBox } = useSafeBox();

  function handleTabForm() {
    setTab('form');
  }
  function handleTabUsers() {
    setTab('users');
  }

  const closeModal = useCallback(() => {
    setIsOpenParticipantModal(false);
  }, []);

  function addUsers(usersAdmin: string[], usersParticipant: string[]) {
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
          ...usersParticipant,
        ],
        usuarios_escrita_deletado: JSON.parse(
          currentSafeBox.usuarios_escrita_deletado
        ),
        usuarios_leitura: [
          ...JSON.parse(currentSafeBox.usuarios_leitura),
          ...usersAdmin,
        ],
        usuarios_leitura_deletado: JSON.parse(
          currentSafeBox.usuarios_leitura_deletado
        ),
      });
    }
  }

  return (
    <>
      <AddParticipantModal
        isOpen={isOpenAddParticipantModal}
        onRequestClose={closeModal}
        callback={addUsers}
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
              text="Adicionar Participante"
              Icon={<IoMdAdd />}
              onClick={() => setIsOpenParticipantModal(true)}
            />
          )}
        </div>
        {tab === 'form' ? <Form /> : <Users />}
      </div>
    </>
  );
}
