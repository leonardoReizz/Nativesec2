import { IoMdAdd } from 'react-icons/io';
import { Dropdown } from 'renderer/components/Dropdown';
import { FieldModalWithDropdown } from 'renderer/components/Modals/FieldModalWithDropdown';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { Badge } from '@chakra-ui/react';
import { Input } from 'renderer/components/Inputs/Input';
import { Button } from 'renderer/components/Buttons/Button';
import { useWorkspaceMembers } from '@/renderer/hooks/useWorkspaceMembers';
import styles from './styles.module.sass';

export function WorkspaceMembers() {
  const {
    handleDropDown,
    remove,
    currentUserDelete,
    addUser,
    isOpenVerifyNameModal,
    isOpenFieldModal,
    handleAddParticipant,
    handleCloseVerifyNameModal,
    handleCloseFieldModal,
    options,
    userOptions,
    currentOrganization,
    filteredAdmin,
    filteredGuestAdmin,
    filteredGuestParticipant,
    filteredParticipant,
    changeInput,
    isParticipant,
    theme,
    loading,
  } = useWorkspaceMembers();

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
        loading={loading}
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
            <Button
              text="Adicionar Participante"
              Icon={<IoMdAdd />}
              onClick={handleAddParticipant}
              theme={theme}
              disabled={isParticipant}
            />
          </header>
          <main>
            <div className={styles.participantContainer}>
              <div className={styles.participants}>
                <div className={styles.title}>
                  <span>Usuario</span>
                  <span>Nivel de Acesso</span>
                </div>
                <div
                  className={styles.participant}
                  key={currentOrganization?.dono}
                >
                  <h4>{currentOrganization?.dono}</h4>
                  <Dropdown
                    theme={theme}
                    options={[{ id: 1, label: 'Dono', value: 'Dono' }]}
                    value="Dono"
                    onChange={(option) =>
                      handleDropDown(
                        option,
                        'admin',
                        String(currentOrganization?.dono)
                      )
                    }
                    className={styles.dropDown}
                    disabled
                  />
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
                      disabled={isParticipant}
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
                      disabled={isParticipant}
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
                      options={userOptions}
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
                      options={userOptions}
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
