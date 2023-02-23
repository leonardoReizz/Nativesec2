import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import Badge from 'renderer/components/Badge';
import { Button } from 'renderer/components/Buttons/Button';
import { FieldModalWithDropdown } from 'renderer/components/Modals/FieldModalWithDropdown';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { StepFourProps } from '../types';
import styles from './styles.module.sass';

const options = [
  { id: 1, value: 'guestParticipant', label: 'Participante' },
  { id: 2, value: 'guestAdmin', label: 'Administrador' },
];

interface AddUserType {
  email: string;
  type: {
    id: number;
    value: 'guestParticipant' | 'guestAdmin';
    label: 'Participante' | 'Administrador';
  };
}

export function StepThree({ users, setUsers, theme }: StepFourProps) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleDeleteUser = (userEmail: string) => {
    const filter = users.filter((user) => {
      if (user.email !== userEmail) {
        return user;
      }
      return undefined;
    });
    setUsers(filter);
  };

  const closeModal = useCallback(() => {
    setIsOpenModal(false);
  }, []);

  const addUser = useCallback(
    (newUser: AddUserType) => {
      const filter = users.filter((user) => user.email === newUser.email);
      if (!filter.length) {
        setIsOpenModal(false);
        return setUsers([
          ...users,
          {
            email: newUser.email,
            isAdmin: newUser.type.value === 'guestAdmin',
          },
        ]);
      }
      return toast.error('Email já adicionado', {
        ...toastOptions,
        toastId: 'emailAlreadyExists',
      });
    },
    [users]
  );

  function openModal() {
    setIsOpenModal(true);
  }
  function removeUser() {}

  return (
    <>
      <FieldModalWithDropdown
        isOpen={isOpenModal}
        onRequestClose={closeModal}
        callback={addUser}
        options={options}
        inputText="Adicionar"
        title="Adicionar membro a organização"
      />
      <div
        className={`${styles.stepFour} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <h3>Convide os membros para sua organização</h3>

        <div className={styles.list}>
          <div>
            <h4>Participantes</h4>
            <h4>Administradores</h4>
          </div>
          <div className={styles.emails_container}>
            <div className={styles.emails_list}>
              {users.map(
                (user) =>
                  !user.isAdmin && (
                    <Badge
                      key={user.email}
                      text={user.email}
                      onClick={() => handleDeleteUser(user.email)}
                    />
                  )
              )}
            </div>
            <div className={styles.emails_list}>
              {users.map(
                (user) =>
                  user.isAdmin && (
                    <Badge
                      key={user.email}
                      text={user.email}
                      onClick={() => handleDeleteUser(user.email)}
                    />
                  )
              )}
            </div>
          </div>
        </div>
        <Button text="Adicionar Membro" onClick={openModal} theme={theme} />
      </div>
    </>
  );
}
