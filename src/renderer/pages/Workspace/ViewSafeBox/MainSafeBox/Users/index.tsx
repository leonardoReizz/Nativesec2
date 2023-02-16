/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { Input } from 'renderer/components/Inputs/Input';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Dropdown } from 'renderer/components/Dropdown';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { useLoading } from 'renderer/hooks/useLoading';
import styles from './styles.module.sass';

const usersOptions = [
  {
    id: 1,
    value: 'participant',
    label: 'Apenas Leitura',
  },
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

interface IUserDelete {
  email: string;
  type: 'admin' | 'participant';
}

export default function Users() {
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);
  const { loading, updateLoading } = useLoading();
  const [typeUserAdd, setTypeUserAdd] = useState<'admin' | 'participant'>(
    'participant'
  );
  const [email, setEmail] = useState<string>('');
  const [currentUserDelete, setCurrentUserDelete] = useState<
    IUserDelete | undefined
  >();

  const {
    usersAdmin,
    usersParticipant,
    changeUsersAdmin,
    changeUsersParticipant,
    currentSafeBox,
    updateUsersSafeBox,
    safeBoxMode,
    isSafeBoxParticipant,
    removeUser,
  } = useSafeBox();

  const { theme } = useUserConfig();

  useEffect(() => {
    changeUsersParticipant(
      currentSafeBox
        ? JSON.parse(currentSafeBox.usuarios_leitura)
        : usersParticipant
    );
    changeUsersAdmin(
      currentSafeBox ? JSON.parse(currentSafeBox.usuarios_escrita) : usersAdmin
    );
  }, [currentSafeBox]);

  function handleAddParticipant() {
    const findAdmin = usersAdmin.filter((user) => user === email);
    const findUser = usersParticipant.filter((user) => user === email);

    if (findAdmin.length > 0 || findUser.length > 0) {
      return;
    }

    if (typeUserAdd === 'participant') {
      changeUsersParticipant([...usersParticipant, email]);
    } else {
      changeUsersAdmin([...usersAdmin, email]);
    }
  }

  const closeVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(false);
  }, []);

  function handleDropDown(item: any, type: any, user: string) {
    if (item.id === 3) {
      setCurrentUserDelete({ email: user, type });
      setIsOpenVerifyNameModal(true);
    } else if (currentSafeBox) {
      updateUsersSafeBox(user, type === 'admin' ? 'participant' : 'admin');
    }
  }

  const handleRemoveUser = useCallback(
    (verified: boolean) => {
      if (verified && currentUserDelete) {
        updateLoading(true);
        removeUser(currentUserDelete);
      }
    },
    [removeUser, currentUserDelete]
  );

  return (
    <>
      <VerifyNameModal
        isOpen={isOpenVerifyNameModal}
        onRequestClose={closeVerifyNameModal}
        callback={handleRemoveUser}
        nameToVerify={currentUserDelete?.email}
        inputText="Confirmar"
        title="Deseja remover"
        isLoading={loading}
      />
      <div
        className={`${styles.users} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        {safeBoxMode === 'edit' && (
          <div className={styles.create}>
            <div>
              <Input text="email" onChange={(e) => setEmail(e.target.value)} />
              <div className={styles.options}>
                <div>
                  <input
                    type="checkbox"
                    checked={typeUserAdd === 'participant'}
                    onClick={() => setTypeUserAdd('participant')}
                  />
                  <span>Leitura</span>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={typeUserAdd === 'admin'}
                    onClick={() => setTypeUserAdd('admin')}
                  />
                  <span>Leitura e Escrita</span>
                </div>
              </div>
            </div>

            <button type="button" onClick={handleAddParticipant}>
              <IoMdAdd />
            </button>
          </div>
        )}
        <div className={styles.participantContainer}>
          <div className={styles.participants}>
            <div className={styles.title}>
              <span>Usuario</span>
              <span>Nivel de Acesso</span>
            </div>
            {usersAdmin.map((user: string) => (
              <div className={styles.participant} key={user}>
                <h4>{user}</h4>
                <Dropdown
                  theme={theme}
                  options={usersOptions}
                  value="Leitura e Escrita"
                  onChange={(item) => handleDropDown(item, 'admin', user)}
                  disabled={safeBoxMode === 'create' || isSafeBoxParticipant}
                />
              </div>
            ))}
            {usersParticipant.map((user: string) => (
              <div className={styles.participant} key={user}>
                <h4>{user}</h4>
                <Dropdown
                  theme={theme}
                  options={usersOptions}
                  value="Apenas Leitura"
                  onChange={(item) => handleDropDown(item, 'participant', user)}
                  disabled={safeBoxMode === 'create' || isSafeBoxParticipant}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
