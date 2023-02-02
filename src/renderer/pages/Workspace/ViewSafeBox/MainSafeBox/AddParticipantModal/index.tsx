/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import ReactModal from 'react-modal';
import * as Yup from 'yup';
import { Input } from 'renderer/components/Inputs/Input';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Button } from 'renderer/components/Buttons/Button';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { IoMdAdd } from 'react-icons/io';
import { UserSettings } from 'renderer/pages/UserSettings';
import styles from './styles.module.sass';

interface UserSelected {
  email: string;
  type: 'admin' | 'participant';
}

interface AddParticipantModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  callback: (users: UserSelected[]) => void;
}

export function AddParticipantModal({
  isOpen,
  callback,
  onRequestClose,
}: AddParticipantModalProps) {
  const { theme } = useUserConfig();
  const [usersSelected, setUsersSelected] = useState<UserSelected[]>([]);
  const { filteredAdmin, filteredParticipant } = useOrganization();

  function save() {
    callback(usersSelected);
  }

  function addUser(email: string, type: 'admin' | 'participant') {
    if (
      usersSelected.filter((selected) => selected.email === email).length === 0
    ) {
      setUsersSelected((state) => [...state, { email, type }]);
    }
  }

  console.log(usersSelected);

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName={styles.reactModalOverlay}
        className={`${styles.reactModalContent} ${
          theme === 'dark' ? styles.dark : styles.light
        }`}
      >
        <h3>Adicionar Participantes ao Cofre</h3>
        <div className={styles.users}>
          {filteredAdmin.map((user: string) => (
            <div
              className={`${styles.user} ${
                usersSelected.filter((selected) => selected.email === user)
                  .length > 0
                  ? styles.selected
                  : ''
              }`}
            >
              <span>{user}</span>
              <button
                type="button"
                onClick={() => addUser(user, 'participant')}
              >
                <IoMdAdd />
              </button>
            </div>
          ))}
          {filteredParticipant.map((user: string) => (
            <div
              className={`${styles.user} ${
                usersSelected.filter((selected) => selected.email === user)
                  .length > 0
                  ? styles.selected
                  : ''
              }`}
            >
              <button type="button" onClick={() => addUser(user, 'admin')}>
                {user} <IoMdAdd />
              </button>
            </div>
          ))}
        </div>
        <Button text="Salvar" onClick={save} />
        <Button text="Cancelar" onClick={onRequestClose} />
      </ReactModal>
    </>
  );
}
