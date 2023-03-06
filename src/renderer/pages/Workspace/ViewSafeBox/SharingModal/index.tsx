import { ISafeBox } from '@/renderer/contexts/SafeBoxesContext/types';
import { UserConfigContext } from '@/renderer/contexts/UserConfigContext/UserConfigContext';
import { updateUsersSafeBox } from '@/renderer/services/ipc/SafeBox';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useCallback, useContext, useState } from 'react';
import { BiDotsVerticalRounded, BiMinus, BiPlus } from 'react-icons/bi';
import { OrganizationsContext } from '@/renderer/contexts/OrganizationsContext/OrganizationsContext';
import { Input } from '@/renderer/components/Inputs/Input';
import { Button } from '@/renderer/components/Buttons/Button';
import { Dropdown } from './Dropdown';
import styles from './styles.module.sass';

interface SharingModalProps {
  safeBox: ISafeBox;
}

interface IUserSelected {
  email: string;
  type: 'participant' | 'admin';
}

export function SharingModal({ safeBox }: SharingModalProps) {
  const { theme } = useContext(UserConfigContext);
  const { currentOrganization } = useContext(OrganizationsContext);
  const [selectedUsers, setSelectedUsers] = useState<IUserSelected[]>([]);

  const handleUpdateSafeBox = useCallback(
    (type: 'participant' | 'admin', email: string) => {
      let participantUsers = JSON.parse(safeBox.usuarios_leitura);
      let adminUsers = JSON.parse(safeBox.usuarios_escrita);

      if (type === 'participant') {
        adminUsers.filter((user: string) => user !== email);
        participantUsers = [...participantUsers, email];
      } else {
        participantUsers.filter((user: string) => user !== email);
        adminUsers = [...adminUsers, email];
      }

      updateUsersSafeBox({
        ...safeBox,
        id: safeBox._id,
        usuarios_leitura: participantUsers,
        usuarios_escrita: adminUsers,
        usuarios_escrita_deletado: JSON.parse(
          safeBox.usuarios_escrita_deletado
        ),
        usuarios_leitura_deletado: JSON.parse(
          safeBox.usuarios_leitura_deletado
        ),
      });
    },
    [safeBox]
  );

  const handleRemoveUser = useCallback(
    (type: 'participant' | 'admin', email: string) => {
      const participantUsers = JSON.parse(safeBox.usuarios_leitura);
      let adminUsers = JSON.parse(safeBox.usuarios_escrita);

      if (type === 'participant') {
        participantUsers.filter((user: string) => user !== email);
      } else {
        adminUsers = adminUsers.filter((user: string) => user !== email);
      }

      updateUsersSafeBox({
        ...safeBox,
        id: safeBox._id,
        usuarios_leitura: participantUsers,
        usuarios_escrita: adminUsers,
        usuarios_escrita_deletado: JSON.parse(
          safeBox.usuarios_escrita_deletado
        ),
        usuarios_leitura_deletado: JSON.parse(
          safeBox.usuarios_leitura_deletado
        ),
      });
    },
    [safeBox]
  );

  function handleAddSelectedUser({ email, type }: IUserSelected) {
    setSelectedUsers((state) => [...state, { email, type }]);
  }

  function handleRemoveSelectedUser(email: string) {
    setSelectedUsers((state) => state.filter((user) => user.email !== email));
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.content}>
        <Dialog.Title>Compartilhamento {safeBox.nome} </Dialog.Title>
        <Tabs.Root className={styles.tabsRoot} defaultValue="tab1">
          <Tabs.List className={styles.tabsList}>
            <Tabs.Trigger className={styles.tabsTrigger} value="tab1">
              Adicionar Participante
            </Tabs.Trigger>
            <Tabs.Trigger className={styles.tabsTrigger} value="tab2">
              Participantes
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className={styles.tabsContent} value="tab1">
            <div className={styles.addUserContainer}>
              <div className={styles.search}>
                <Input text="Buscar usuario" />
              </div>
              <div className={styles.users}>
                {[
                  ...JSON.parse(currentOrganization?.participantes || '[]'),
                  ...JSON.parse(currentOrganization?.administradores || '[]'),
                ].map((email: string) => {
                  return (
                    <div
                      className={`${styles.user} ${
                        selectedUsers.filter((user) => user.email === email)
                          .length
                          ? styles.selected
                          : ''
                      }`}
                    >
                      <h4>{email}</h4>
                      {selectedUsers.filter((user) => user.email === email)
                        .length > 0 && (
                        <Button
                          Icon={<BiMinus />}
                          color="red"
                          theme={theme}
                          onClick={() => handleRemoveSelectedUser(email)}
                          type="button"
                        />
                      )}

                      {selectedUsers.filter((user) => user.email === email)
                        .length === 0 && (
                        <Button
                          Icon={<BiPlus />}
                          color="green"
                          theme={theme}
                          onClick={() =>
                            handleAddSelectedUser({
                              email,
                              type: 'participant',
                            })
                          }
                          type="button"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content className={styles.tabsContent} value="tab2">
            <div className={styles.users}>
              <div className={styles.userContainer}>
                <h3>Leitura e Escrita</h3>
                <div className={styles.list}>
                  {JSON.parse(safeBox.usuarios_escrita).map((email: string) => {
                    return (
                      <div className={styles.user}>
                        <h4>{email}</h4>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button
                              type="button"
                              className={styles.iconButton}
                              aria-label="Customise options"
                            >
                              <BiDotsVerticalRounded />
                            </button>
                          </DropdownMenu.Trigger>

                          <Dropdown
                            theme={theme}
                            handleUpdateSafeBox={handleUpdateSafeBox}
                            email={email}
                            handleRemoveUser={handleRemoveUser}
                          />
                        </DropdownMenu.Root>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.userContainer}>
                <h3>Leitura e Escrita</h3>
                <div className={styles.list}>
                  {JSON.parse(safeBox.usuarios_leitura).map((email: string) => {
                    return (
                      <div className={styles.user}>
                        <h4>{email}</h4>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button
                              type="button"
                              className={styles.iconButton}
                              aria-label="Customise options"
                            >
                              <BiDotsVerticalRounded />
                            </button>
                          </DropdownMenu.Trigger>

                          <Dropdown
                            theme={theme}
                            handleUpdateSafeBox={handleUpdateSafeBox}
                            email={email}
                            handleRemoveUser={handleRemoveUser}
                          />
                        </DropdownMenu.Root>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
