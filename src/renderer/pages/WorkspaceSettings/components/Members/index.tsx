import { useCallback, useState, useEffect } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { Dropdown } from 'renderer/components/Dropdown';
import { FieldModalWithDropdown } from 'renderer/components/Modals/FieldModalWithDropdown';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Badge } from '@chakra-ui/react';
import { useLoading } from 'renderer/hooks/useLoading';
import { Input } from 'renderer/components/Inputs/Input';
import styles from './styles.module.sass';

interface IAddUserData {
  email: string;
  type: {
    id: number;
    label: string;
    value: 'guestParticipant' | 'guestAdmin';
  };
}

interface ICurrentUserDelete {
  email: string;
  type: 'admin' | 'participant' | 'guestParticipant' | 'guestAdmin';
}

const options = [
  { id: 1, value: 'guestParticipant', label: 'Participante' },
  { id: 2, value: 'guestAdmin', label: 'Administrador' },
];

const userOptions = [{ id: 3, value: 'remove', label: 'Remover' }];

const guestOptions = [
  { id: 1, value: 'participant', label: 'Apenas Leitura' },
  {
    id: 2,
    value: 'admin',
    label: 'Leitura e Escrita',
  },
  {
    id: 3,
    value: 'remove',
    label: 'Remover',
  },
];

export function Members() {
  const { loading, updateLoading } = useLoading();

  const {
    currentOrganization,
    addNewParticipant,
    removeUser,
    removeInvite,
    filteredAdmin,
    filteredGuestAdmin,
    filteredGuestParticipant,
    filteredParticipant,
    changeInput,
  } = useOrganization();
  const { theme } = useUserConfig();

  const [currentUserDelete, setCurrentUserDelete] = useState<
    ICurrentUserDelete | undefined
  >();

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
    setIsOpenFieldModal(true);
  }

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
      updateLoading(true);
      if (
        currentUserDelete.type === 'admin' ||
        currentUserDelete.type === 'participant'
      ) {
        removeUser({
          organizationId: currentOrganization._id,
          email: currentUserDelete?.email,
          type: currentUserDelete?.type,
        });
      } else {
        removeInvite({
          organizationId: currentOrganization._id,
          email: currentUserDelete?.email,
          type: currentUserDelete?.type,
        });
      }
    }
  }

  const changeUser = useCallback(
    (user: any, type: 'guestAdmin' | 'guestParticipant') => {
      if (currentOrganization) {
        removeInvite({
          email: user,
          organizationId: currentOrganization?._id,
          type,
        });

        addNewParticipant({
          email: user,
          organizationId: currentOrganization?._id,
          type,
        });
      }
    },
    []
  );

  useEffect(() => {
    if (!loading) {
      setCurrentUserDelete(undefined);
      setIsOpenFieldModal(false);
      setIsOpenVerifyNameModal(false);
    }
  }, [loading]);

  function handleDropDown(user: any, type: any, email: string) {
    switch (user.id) {
      case 1:
        // Apenas leitura
        if (currentOrganization) {
          removeInvite({
            email,
            organizationId: currentOrganization?._id,
            type,
          });
          addNewParticipant({
            email,
            organizationId: currentOrganization?._id,
            type: 'guestParticipant',
          });
        }
        break;
      case 2:
        // Leitura e escrita
        if (currentOrganization) {
          removeInvite({
            email,
            organizationId: currentOrganization?._id,
            type,
          });
          addNewParticipant({
            email,
            organizationId: currentOrganization?._id,
            type: 'guestAdmin',
          });
        }
        break;
      case 3:
        setCurrentUserDelete({ email, type });
        setIsOpenVerifyNameModal(true);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <VerifyNameModal
        title="Confirme o email do usuario"
        nameToVerify={currentUserDelete?.email}
        inputText="Email"
        callback={(verified) => remove(verified)}
        isOpen={isOpenVerifyNameModal}
        isLoading={loading}
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
        <div className={styles.membersContainer}>
          <header>
            <div className={styles.search}>
              <Input
                theme={theme}
                placeholder="Buscar usuario"
                onChange={(e) => changeInput(e.target.value)}
              />
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
                {filteredAdmin.map((user: string) => (
                  <div className={styles.participant} key={user}>
                    <h4>{user}</h4>
                    <Dropdown
                      theme={theme}
                      options={userOptions}
                      value="Leitura e Escrita"
                      onChange={(option) =>
                        handleDropDown(option, 'admin', user)
                      }
                      className={styles.dropDown}
                    />
                  </div>
                ))}
                {filteredParticipant.map((user: string) => (
                  <div className={styles.participant} key={user}>
                    <h4>{user}</h4>
                    <Dropdown
                      theme={theme}
                      options={userOptions}
                      value="Apenas Leitura"
                      onChange={(option) =>
                        handleDropDown(option, 'participant', user)
                      }
                      className={styles.dropDown}
                    />
                  </div>
                ))}
                {filteredGuestAdmin.map((user: string) => (
                  <div className={styles.participant} key={user}>
                    <h4>
                      {user}
                      <Badge colorScheme="orange" fontSize="x-small">
                        Convite Pendente
                      </Badge>
                    </h4>
                    <Dropdown
                      theme={theme}
                      options={guestOptions}
                      value="Leitura e Escrita"
                      onChange={(option) =>
                        handleDropDown(option, 'guestAdmin', user)
                      }
                      className={styles.dropDown}
                    />
                  </div>
                ))}
                {filteredGuestParticipant.map((user: string) => (
                  <div className={styles.participant} key={user}>
                    <h4>
                      {user}
                      <Badge colorScheme="orange" fontSize="x-small">
                        Convite Pendente
                      </Badge>
                    </h4>
                    <Dropdown
                      theme={theme}
                      options={guestOptions}
                      value="Apenas Leitura"
                      onChange={(option) =>
                        handleDropDown(option, 'guestParticipant', user)
                      }
                      className={styles.dropDown}
                    />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
