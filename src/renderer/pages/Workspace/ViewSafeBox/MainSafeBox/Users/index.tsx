/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { IoIosClose, IoMdAdd } from 'react-icons/io';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import { Input } from 'renderer/components/Inputs/Input';
import styles from './styles.module.sass';

export default function Users() {
  const [typeUserAdd, setTypeUserAdd] = useState<'admin' | 'participant'>(
    'participant'
  );
  const [email, setEmail] = useState<string>('');
  const [readUsers, setReadUsers] = useState<string[]>([]);
  const [writeUsers, setWriteUsers] = useState<string[]>([]);
  const { safeBoxMode } = useContext(SafeBoxModeContext);

  const { currentOrganization } = useContext(OrganizationsContext);
  const {
    usersAdmin,
    usersParticipant,
    changeUsersAdmin,
    changeUsersParticipant,
  } = useContext(CreateSafeBoxContext);
  const { theme } = useContext(ThemeContext);
  const { currentSafeBox } = useContext(SafeBoxesContext);

  useEffect(() => {
    changeUsersParticipant(
      JSON.parse(currentSafeBox?.usuarios_leitura || '') as string[]
    );
    changeUsersAdmin(
      JSON.parse(currentSafeBox?.usuarios_escrita || '') as string[]
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

  function handleRemoveParticipant(
    emailuser: string,
    type: 'admin' | 'participant'
  ) {
    if (type === 'participant') {
      const readUsersWithoutParticipant = readUsers.filter(
        (user) => user !== emailuser
      );
      setReadUsers(readUsersWithoutParticipant);
    } else {
      const writeUsersWithoutParticipant = writeUsers.filter(
        (user) => user !== emailuser
      );
      setWriteUsers(writeUsersWithoutParticipant);
    }
  }

  console.log(readUsers);
  return (
    <div
      className={`${styles.users} ${
        theme === 'dark' ? styles.dark : styles.white
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
        <div className={styles.participantes}>
          <h3>Usuarios de Leitura</h3>
          <ul>
            {usersParticipant.map((user: string) => (
              <li key={user}>
                {safeBoxMode === 'edit' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(user, 'participant')}
                  >
                    <IoIosClose />
                  </button>
                )}
                {user}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.participantes}>
          <h3>Usuarios de Escrita</h3>
          <ul>
            {usersAdmin.map((user: string) => (
              <li key={user}>
                {safeBoxMode === 'edit' && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(user, 'admin')}
                  >
                    <IoIosClose />
                  </button>
                )}
                {user}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
