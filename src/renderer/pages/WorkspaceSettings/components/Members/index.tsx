import { useCallback, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { MdPending } from 'react-icons/md';
import { Dropdown } from 'renderer/components/Dropdown';
import { FieldModalWithDropdown } from 'renderer/components/Modals/FieldModalWithDropdown';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Badge } from '@chakra-ui/react';
import styles from './styles.module.sass';

type MembersState = 'participant' | 'guest';

interface IAddUserData {
  email: string;
  type: {
    id: number;
    label: string;
    value: 'participant' | 'admin' | 'guestParticipant' | 'guestAdmin';
  };
}

interface ICurrentUserDelete {
  email: string;
  type: 'admin' | 'participant';
}

export function Members() {
  const { currentOrganization, addNewParticipant, removeUser } =
    useOrganization();
  const { theme } = useUserConfig();

  const [currentUserDelete, setCurrentUserDelete] = useState<
    ICurrentUserDelete | undefined
  >();
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

  // function handleDeleteUser(email: string, type: 'admin' | 'participant') {
  //   setCurrentUserDelete({ email, type });
  //   setIsOpenVerifyNameModal(true);
  // }

  // function handleRemoveInvite(email: string, type: 'admin' | 'participant') {
  //   setCurrentUserDelete({ email, type });
  //   setIsOpenVerifyNameModal(true);
  // }

  function addUser(user: IAddUserData) {
    if (currentOrganization) {
      addNewParticipant({
        type: user.type.value,
        email: user.email,
        organizationId: currentOrganization?._id,
      });
    }
  }

  function remove(verified: boolean) {
    if (verified && currentOrganization && currentUserDelete) {
      if (
        currentUserDelete.type === 'admin' ||
        currentUserDelete.type === 'participant'
      ) {
        removeUser({
          organizationId: currentOrganization._id,
          email: currentUserDelete?.email,
          type: currentUserDelete?.type,
        });
        setCurrentUserDelete(undefined);
      } else {
      }
    }
  }

  const options = [
    { id: 1, value: 'participant', label: 'Participante' },
    { id: 2, value: 'admin', label: 'Administrador' },
  ];

  const userOptions = [
    { id: 1, value: 'participant', label: 'Participante' },
    { id: 2, value: 'admin', label: 'Administrador' },
    { id: 3, value: 'remove', label: 'Remover' },
  ];

  const changeUser = useCallback((item: any, type: string) => {}, []);

  return (
    <>
      <VerifyNameModal
        title="Confirme o email do usuario"
        nameToVerify={currentUserDelete?.email}
        inputText="Email"
        callback={(verified) => remove(verified)}
        isOpen={isOpenVerifyNameModal}
        onRequestClose={handleCloseVerifyNameModal}
      />
      <FieldModalWithDropdown
        title="Insira o email do usuario"
        callback={(user) => addUser(user)}
        inputText="Email"
        isOpen={isOpenFieldModal}
        onRequestClose={handleCloseFieldModal}
        options={options}
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
          <div className={styles.participantContainer}>
            <div className={styles.participants}>
              <div className={styles.title}>
                <span>Usuario</span>
                <span>Nivel de Acesso</span>
              </div>
              {JSON.parse(
                currentOrganization?.convidados_administradores || '[]'
              ).map((user: string) => (
                <div className={styles.participant} key={user}>
                  <h4>
                    {user}
                    <Badge colorScheme="orange" fontSize="x-small">
                      Convite Pendente
                    </Badge>
                    {/* <Tooltip
                      className={styles.tooltip}
                      hasArrow
                      label="Convite Pendente"
                      closeDelay={100}
                    >
                      <span>
                        <MdPending />
                      </span>
                    </Tooltip> */}
                  </h4>
                  <Dropdown
                    theme={theme}
                    options={userOptions}
                    value="Leitura e Escrita"
                    onChange={(item) => changeUser(item, 'guestAdmin')}
                  />
                </div>
              ))}
              {JSON.parse(
                currentOrganization?.convidados_participantes || '[]'
              ).map((user: string) => (
                <div className={styles.participant} key={user}>
                  <h4
                    id="invitePending"
                    data-tooltip-content="Convite pendente"
                  >
                    {user}
                    <MdPending />
                  </h4>
                  <Dropdown
                    theme={theme}
                    options={userOptions}
                    value="Apenas Leitura"
                    onChange={(item) => changeUser(item, 'guestParticipant')}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* {currentOrganization && membersState === 'participant' && (
            <>
              <TableMembers
                title="Administradores"
                options={JSON.parse(currentOrganization.administradores)}
                callback={(user) => handleDeleteUser(user, 'admin')}
              />
              <TableMembers
                title="Participantes"
                options={JSON.parse(currentOrganization.participantes)}
                callback={(user) => handleDeleteUser(user, 'participant')}
              />
            </>
          )} */}

          {/* {currentOrganization && membersState === 'guest' && (
            <>
              <TableMembers
                title="Convidados Administradores"
                options={JSON.parse(
                  currentOrganization.convidados_administradores
                )}
                callback={(user) => handleRemoveInvite(user, 'admin')}
              />
              <TableMembers
                title="Convidados Participantes"
                options={JSON.parse(
                  currentOrganization.convidados_participantes
                )}
                callback={(user) => handleRemoveInvite(user, 'participant')}
              />
            </>
          )} */}
        </main>
      </div>
    </>
  );
}
