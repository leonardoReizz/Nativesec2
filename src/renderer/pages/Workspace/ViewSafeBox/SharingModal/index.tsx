import { ISafeBox } from '@/renderer/contexts/SafeBoxesContext/types';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Popover from '@radix-ui/react-popover';

import { BiDotsVerticalRounded, BiMinus, BiPlus } from 'react-icons/bi';
import { Input } from '@/renderer/components/Inputs/Input';
import { Button } from '@/renderer/components/Buttons/Button';
import { useSharingModal } from '@/renderer/hooks/useSharingModal';
import { FaUsers } from 'react-icons/fa';
import { Dropdown } from './Dropdown';
import styles from './styles.module.sass';
import { PopoverComponent } from './Popover';

interface SharingModalProps {
  safeBox: ISafeBox;
  closeSharingModal: () => void;
}

export function SharingModal({
  safeBox,
  closeSharingModal,
}: SharingModalProps) {
  const {
    handleAddSelectedUser,
    handleRemoveSelectedUser,
    handleRemoveUser,
    handleUpdateUserSafeBox,
    handleUpdateSelectedUsersSafeBox,
    filteredUsers,
    updateSearchUserInput,
    searchUserInput,
    selectedUsers,
    theme,
  } = useSharingModal(safeBox, closeSharingModal);

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
              Leitura e Escrita
            </Tabs.Trigger>
            <Tabs.Trigger className={styles.tabsTrigger} value="tab3">
              Apenas Leitura
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className={styles.tabsContent} value="tab1">
            <div className={styles.addUserContainer}>
              <div className={styles.search}>
                <Input
                  text="Buscar usuário"
                  value={searchUserInput}
                  onChange={updateSearchUserInput}
                />
              </div>
              <div className={styles.users}>
                {filteredUsers.length === 0 && (
                  <div className={styles.noUsers}>
                    <FaUsers />
                    <p>Nenhum usuário disponivel.</p>
                    <p>
                      Adicione usuários a sua organização para poder
                      compartilhar seus cofres.
                    </p>
                  </div>
                )}
                {filteredUsers.map((email: string) => {
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

                      <div className={styles.buttonUser}>
                        <p>
                          {selectedUsers.filter(
                            (user) => user.email === email
                          )[0]?.type === 'participant' && 'Apenas Leitura'}

                          {selectedUsers.filter(
                            (user) => user.email === email
                          )[0]?.type === 'admin' && 'Leitura e Escrita'}
                        </p>
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
                          <Popover.Root>
                            <Popover.Trigger asChild>
                              <button
                                type="button"
                                className={styles.addButton}
                              >
                                <BiPlus />{' '}
                              </button>
                            </Popover.Trigger>
                            <PopoverComponent
                              callback={handleAddSelectedUser}
                              email={email}
                            />
                          </Popover.Root>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.buttons}>
                <Button
                  color="red"
                  text="Cancelar"
                  onClick={closeSharingModal}
                />
                <Button
                  color="green"
                  text="Salvar"
                  onClick={handleUpdateSelectedUsersSafeBox}
                />
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content className={styles.tabsContent} value="tab2">
            <div className={styles.users}>
              <div className={styles.userContainer}>
                <div className={styles.list}>
                  {JSON.parse(safeBox.usuarios_escrita).length === 0 && (
                    <div className={styles.noUsers}>
                      <FaUsers />
                      <p>Nenhum usuário por aqui.</p>
                    </div>
                  )}
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
                            handleUpdateSafeBox={handleUpdateUserSafeBox}
                            email={email}
                            handleRemoveUser={handleRemoveUser}
                            permission="admin"
                            usersAdmin={JSON.parse(safeBox.usuarios_escrita)}
                            usersParticipant={JSON.parse(
                              safeBox.usuarios_leitura
                            )}
                          />
                        </DropdownMenu.Root>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content className={styles.tabsContent} value="tab3">
            <div className={styles.users}>
              <div className={styles.userContainer}>
                <div className={styles.list}>
                  {JSON.parse(safeBox.usuarios_leitura).length === 0 && (
                    <div className={styles.noUsers}>
                      <FaUsers />
                      <p>Nenhum usuário por aqui.</p>
                    </div>
                  )}
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
                            handleUpdateSafeBox={handleUpdateUserSafeBox}
                            email={email}
                            handleRemoveUser={handleRemoveUser}
                            permission="participant"
                            usersAdmin={JSON.parse(safeBox.usuarios_escrita)}
                            usersParticipant={JSON.parse(
                              safeBox.usuarios_leitura
                            )}
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
