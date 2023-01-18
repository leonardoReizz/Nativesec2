import { useCallback, useState } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import { IoMdAdd } from 'react-icons/io';
import { FieldModal } from 'renderer/components/Modals/FieldModal';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import styles from './styles.module.sass';

type MembersState = 'participant' | 'guest';

const teste = [
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
  'user@gmail.com',
];

export function Members() {
  const { currentOrganization } = useOrganization();
  const { theme } = useUserConfig();

  const [currentUserDelete, setCurrentUserDelete] = useState<string | null>(
    null
  );
  const [membersState, setMembersState] = useState<MembersState>('participant');

  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);
  const [isOpenFieldModal, setIsOpenFieldModal] = useState<boolean>(false);

  const handleCloseVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(false);
  }, []);

  const handleCloseFieldModal = useCallback(() => {
    setIsOpenFieldModal(false);
  }, []);

  function handleAddParticipant() {
    setMembersState('guest');
    setIsOpenFieldModal(true);
  }

  function handleDeleteUser(user: string) {
    setCurrentUserDelete(user);
    setIsOpenVerifyNameModal(true);
  }

  function addUser(email: string) {
    
  }

  return (
    <>
      <VerifyNameModal
        title="Confirme o email do usuario"
        nameToVerify={currentUserDelete}
        inputText="Email"
        verifyName={() => {}}
        isOpen={isOpenVerifyNameModal}
        onRequestClose={handleCloseVerifyNameModal}
      />
      <FieldModal
        title="Insira o email do usuario"
        callback={(user) => addUser(user)}
        inputText="Email"
        isOpen={isOpenFieldModal}
        onRequestClose={handleCloseFieldModal}
      />
      <div
        className={`${styles.members} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <header>
          <div className={styles.actions}>
            <button
              type="button"
              className={`${
                membersState === 'participant' ? styles.selected : ''
              }`}
              onClick={() => setMembersState('participant')}
            >
              Participantes
            </button>
            <button
              type="button"
              className={`${membersState === 'guest' ? styles.selected : ''}`}
              onClick={() => setMembersState('guest')}
            >
              Convidados
            </button>
          </div>
          <button
            type="button"
            onClick={handleAddParticipant}
            className={styles.participantButton}
          >
            <IoMdAdd />
            Adicionar Participante
          </button>
        </header>
        <main>
          <div className={styles.title}>
            <h4>Usuarios de Leitura e Escrita</h4>
          </div>
          <div className={styles.membersSection}>
            {/* {JSON.parse(currentOrganization?.administradores || '[]')?.map(
            (admin: string) => (
              <div className={styles.participant}>{admin}</div>
            )
          )} */}

            {teste.map((admin: string) => (
              <div className={styles.participant}>
                <div className={styles.info}>
                  <div className={styles.img}>{admin[0]}</div>
                  <span>{admin}</span>
                </div>
                <button type="button" onClick={() => handleDeleteUser(admin)}>
                  <BsFillTrashFill />
                </button>
              </div>
            ))}
          </div>
          <div className={styles.title}>
            <h4>Usuarios de Leitura</h4>
          </div>
          <div className={styles.membersSection}>
            {teste.map((admin: string) => (
              <div className={styles.participant}>
                <div className={styles.info}>
                  <div className={styles.img}>{admin[0]}</div>
                  <span>{admin}</span>
                </div>
                <button type="button" onClick={() => handleDeleteUser(admin)}>
                  <BsFillTrashFill />
                </button>
              </div>
            ))}
            {/* {JSON.parse(currentOrganization?.administradores || '[]')?.map(
            (admin: string) => (
              <div className={styles.participant}>{admin}</div>
            )
          )} */}
          </div>
        </main>
      </div>
    </>
  );
}
