/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { Input } from 'renderer/components/Inputs/Input';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import { useUserConfig } from 'renderer/hooks/useUserConfig/useUserConfig';
import { Dropdown } from 'renderer/components/Dropdown';
import { VerifyModal } from 'renderer/components/Modals/VerifyModal';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { toast } from 'react-toastify';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { useOrganization } from 'renderer/hooks/useOrganization/useOrganization';
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

export default function Users() {
  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);
  const [typeUserAdd, setTypeUserAdd] = useState<'admin' | 'participant'>(
    'participant'
  );
  const [email, setEmail] = useState<string>('');
  const [readUsers, setReadUsers] = useState<string[]>([]);
  const [writeUsers, setWriteUsers] = useState<string[]>([]);
  const { safeBoxMode, updateUsers } = useSafeBox();
  const [currentUserDelete, setCurrentUserDelete] = useState<any | undefined>();

  const {
    usersAdmin,
    usersParticipant,
    changeUsersAdmin,
    changeUsersParticipant,
  } = useContext(CreateSafeBoxContext);
  const { currentOrganization } = useOrganization();

  const { theme } = useUserConfig();
  const { currentSafeBox } = useContext(SafeBoxesContext);

  useEffect(() => {
    changeUsersParticipant(
      currentSafeBox ? JSON.parse(currentSafeBox.usuarios_leitura) : []
    );
    changeUsersAdmin(
      currentSafeBox ? JSON.parse(currentSafeBox.usuarios_escrita) : []
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

  console.log(writeUsers, readUsers);

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

  const closeVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(false);
  }, []);

  const changeUser = useCallback((item: any) => {
    console.log(item);
    switch (item.id) {
      case 1:
        console.log('change');
        break;
      case 2:
        console.log('change');
        break;
      case 3:
        console.log('open');
        // setIsOpenVerifyModal(true);
        break;
      default:
        break;
    }
  }, []);

  function handleDropDown(user: any, type: any, email: string) {
    if (user.id === 3) {
      setCurrentUserDelete({ email, type });
      setIsOpenVerifyNameModal(true);
    } else if (currentSafeBox) {
      toast.loading('Alterando participantes', {
        ...toastOptions,
        toastId: 'organizationChangeUser',
      });
      if (currentOrganization) {
        updateUsers(usersAdmin, usersParticipant, currentOrganization?._id);
      }
    }
  }

  const removeUser = useCallback((verified: boolean) => {}, []);

  return (
    <>
      <VerifyNameModal
        isOpen={isOpenVerifyNameModal}
        onRequestClose={closeVerifyNameModal}
        callback={removeUser}
        nameToVerify={currentUserDelete}
        inputText="Confirmar"
        title="Deseja remover"
      />
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
                />
              </div>
            ))}
            {usersParticipant.map((user: string) => (
              <div className={styles.participant} key={user}>
                <h4>{user}</h4>
                <Dropdown
                  theme={theme}
                  options={usersOptions}
                  value="Leitura e Escrita"
                  onChange={changeUser}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
