/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Tooltip } from '@chakra-ui/react';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Button } from 'renderer/components/Buttons/Button';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
import { Dropdown } from 'renderer/components/Dropdown';
import { useLoading } from 'renderer/hooks/useLoading';

import styles from './styles.module.sass';

interface UserSelected {
  email: string;
  type: 'admin' | 'participant';
  added: boolean;
}

interface AddParticipantModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  callback: (usersAdmin: string[], usersParticipant: string[]) => void;
}

const options = [
  {
    id: 1,
    value: 'admin',
    label: 'Leitura e Escrita',
  },
  {
    id: 2,
    value: 'participant',
    label: 'Apenas Leitura',
  },
];

export function AddParticipantModal({
  isOpen,
  callback,
  onRequestClose,
}: AddParticipantModalProps) {
  const { theme } = useUserConfig();
  const [usersSelected, setUsersSelected] = useState<UserSelected[]>([]);
  const { loading, updateLoading } = useLoading();
  const { filteredAdmin, filteredParticipant } = useOrganization();
  const [open, setOpen] = useState<boolean[]>([]);

  useEffect(() => {
    const usersAdmin = filteredAdmin.map((email: string) => {
      return { email, type: 'participant', added: false };
    });
    const usersParticipant = filteredParticipant.map((email: string) => {
      return { email, type: 'participant', added: false };
    });
    setUsersSelected([...usersAdmin, ...usersParticipant]);
  }, []);

  function save() {
    updateLoading(true);
    console.log(usersSelected);

    const usersAdmin = usersSelected
      .filter((user) => user.type === 'admin')
      .map((user) => user.email);
    const usersParticipant = usersSelected
      .filter((user) => user.type === 'participant')
      .map((user) => user.email);

    callback(usersAdmin, usersParticipant);
  }

  function handleOpen(index: number) {
    const listOpen = open;

    if (listOpen[index] === true) {
      listOpen[index] = false;
    } else {
      listOpen[index] = true;
    }

    setOpen([...listOpen]);
  }

  function removeUser(index: number) {
    const currentUsers = usersSelected;
    currentUsers[index].added = false;
    currentUsers[index].type = 'participant';
    setUsersSelected(currentUsers);
    handleOpen(index);
  }

  function addUser(index: number) {
    const currentUsers = usersSelected;

    currentUsers[index].added = true;

    setUsersSelected(currentUsers);
    handleOpen(index);
  }

  function changeType(type: 'admin' | 'participant', index: number) {
    const currentUsers = usersSelected;

    currentUsers[index].type = type;

    console.log(currentUsers);
    setUsersSelected([...currentUsers]);
  }

  useEffect(() => {
    if (!loading) {
      onRequestClose();
    }
  }, [loading]);

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
        <h2>Compartilhe o cofre</h2>
        <div className={styles.users}>
          {usersSelected.map((user, index: number) => (
            <div className={`${styles.user}`} key={user.email}>
              <div
                className={`${styles.header} ${
                  user.added ? styles.selected : ''
                }`}
              >
                <span>{user.email}</span>
                {open[index] === true ? (
                  <button type="button" onClick={() => handleOpen(index)}>
                    <BiChevronUp />
                  </button>
                ) : (
                  <>
                    {user.added && (
                      <Tooltip
                        hasArrow
                        label="Remover"
                        aria-label="A tooltip"
                        zIndex={100000}
                      >
                        <button type="button" onClick={() => handleOpen(index)}>
                          <IoMdRemove />
                        </button>
                      </Tooltip>
                    )}

                    {!user.added && (
                      <Tooltip
                        hasArrow
                        label="Adicionar usuario"
                        aria-label="A tooltip"
                        zIndex={100000}
                      >
                        <button type="button" onClick={() => handleOpen(index)}>
                          <IoMdAdd />
                        </button>
                      </Tooltip>
                    )}
                  </>
                )}
              </div>
              <div
                className={`${styles.content} ${
                  open[index] === true ? styles.visible : ''
                }`}
              >
                <div className={styles.permission}>
                  <h3>Nivel de Acesso</h3>
                  <Dropdown
                    options={options}
                    theme={theme}
                    className={styles.dropdown}
                    value={
                      user.type === 'participant'
                        ? 'Apenas Leitura'
                        : 'Leitura e Escrita'
                    }
                    onChange={(option) =>
                      changeType(option.value as 'admin' | 'participant', index)
                    }
                  />
                </div>
                {user.added ? (
                  <Button
                    text="Remover"
                    className={styles.red}
                    onClick={() => removeUser(index)}
                  />
                ) : (
                  <Button
                    text="Adicionar"
                    className={styles.green}
                    onClick={() => addUser(index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <Button text="Salvar" onClick={save} theme={theme} />
        <Button
          text="Cancelar"
          onClick={onRequestClose}
          className={styles.red}
          theme={theme}
        />
      </ReactModal>
    </>
  );
}
