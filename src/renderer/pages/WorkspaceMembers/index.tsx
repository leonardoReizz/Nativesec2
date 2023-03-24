import { IoMdAdd } from 'react-icons/io';
import { FieldModalWithDropdown } from 'renderer/components/Modals/FieldModalWithDropdown';
import { VerifyNameModal } from 'renderer/components/Modals/VerifyNameModal';
import { Badge } from '@chakra-ui/react';
import { Input } from 'renderer/components/Inputs/Input';
import { Button } from 'renderer/components/Buttons/Button';
import { useWorkspaceMembers } from '@/renderer/hooks/useWorkspaceMembers/useWorkspaceMembers';
import { RadixSelect } from '@/renderer/components/Select';
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
    currentOrganization,
    filteredAdmin,
    filteredGuestAdmin,
    filteredGuestParticipant,
    filteredParticipant,
    changeInput,
    isParticipant,
    theme,
    loading,
    optionsOwner,
    optionsRadixUser,
    optionsRadixInvite,
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
                  <RadixSelect
                    options={optionsOwner}
                    placeholder="Select"
                    ariaLabel="Dono"
                    onClick={() => {}}
                    value="owner"
                  />
                </div>
                {filteredAdmin.map((user: string) => (
                  <div className={styles.participant} key={user}>
                    <h4>{user}</h4>
                    <RadixSelect
                      options={optionsRadixUser}
                      placeholder="Select"
                      ariaLabel="Dono"
                      onClick={(value) => handleDropDown(value, user)}
                      value="admin"
                    />
                  </div>
                ))}
                {filteredParticipant.map((user: string) => (
                  <div className={styles.participant} key={user}>
                    <h4>{user}</h4>
                    <RadixSelect
                      options={optionsRadixUser}
                      placeholder="Select"
                      ariaLabel="Participantes"
                      onClick={(value) => handleDropDown(value, user)}
                      value="participant"
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
                    <RadixSelect
                      options={optionsRadixInvite}
                      placeholder="Select"
                      ariaLabel="Dono"
                      onClick={(value) => handleDropDown(value, user)}
                      value="guestAdmin"
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
                    <RadixSelect
                      options={optionsRadixInvite}
                      placeholder="Select"
                      ariaLabel="Convidados Participantes"
                      onClick={(value) => handleDropDown(value, user)}
                      value="guestParticipant"
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
