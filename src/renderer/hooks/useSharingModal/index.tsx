import { OrganizationsContext } from '@/renderer/contexts/OrganizationsContext/OrganizationsContext';
import { ISafeBox } from '@/renderer/contexts/SafeBoxesContext/types';
import { UserConfigContext } from '@/renderer/contexts/UserConfigContext/UserConfigContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  updateUsersSafeBox,
  addSafeBoxUsersIPC,
} from '@/renderer/services/ipc/SafeBox';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { toast } from 'react-toastify';
import { LoadingContext } from '@/renderer/contexts/LoadingContext/LoadingContext';

export interface IUserSelected {
  email: string;
  type: 'participant' | 'admin';
}

export function useSharingModal(
  safeBox: ISafeBox,
  closeSharingModal: () => void
) {
  const { loading, updateLoading } = useContext(LoadingContext);
  const { theme } = useContext(UserConfigContext);
  const { currentOrganization } = useContext(OrganizationsContext);
  const [selectedUsers, setSelectedUsers] = useState<IUserSelected[]>([]);
  const [searchUserInput, setSearchUserInput] = useState<string>('');

  const filteredUsers = [
    ...JSON.parse(currentOrganization?.participantes || '[]'),
    ...JSON.parse(currentOrganization?.administradores || '[]'),
  ]
    .filter((user) => user.toLowerCase().includes(searchUserInput))
    .filter((e) => {
      return (
        [
          ...JSON.parse(safeBox.usuarios_escrita),
          ...JSON.parse(safeBox.usuarios_leitura),
        ].indexOf(e) === -1
      );
    });

  useEffect(() => {
    if (!loading) {
      setSelectedUsers([]);
      setSearchUserInput('');
      closeSharingModal();
    }
  }, [loading]);

  const handleUpdateUserSafeBox = useCallback(
    (type: 'participant' | 'admin', email: string) => {
      toast.loading('Salvando...', {
        ...toastOptions,
        toastId: 'updateSafeBox',
      });
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

  const handleUpdateSelectedUsersSafeBox = useCallback(() => {
    updateLoading(true);
    toast.loading('Salvando...', {
      ...toastOptions,
      toastId: 'updateSafeBox',
    });

    const selectedUsersParticipant = selectedUsers
      .filter((user) => user.type === 'participant')
      .map((user) => user.email);
    const selectedUsersAdmin = selectedUsers
      .filter((user) => user.type === 'admin')
      .map((user) => user.email);

    const participantUsers = [
      ...JSON.parse(safeBox.usuarios_leitura),
      ...selectedUsersParticipant,
    ];

    const adminUsers = [
      ...JSON.parse(safeBox.usuarios_escrita),
      ...selectedUsersAdmin,
    ];

    const usersParticipantDeleted = JSON.parse(
      safeBox.usuarios_leitura_deletado
    ).filter((e: string) => {
      return [...participantUsers, ...adminUsers].indexOf(e) === -1;
    });

    const usersAdminDeleted = JSON.parse(
      safeBox.usuarios_escrita_deletado
    ).filter((e: string) => {
      return [...participantUsers, ...adminUsers].indexOf(e) === -1;
    });

    addSafeBoxUsersIPC({
      ...safeBox,
      usuarios_leitura: participantUsers,
      anexos: JSON.parse(safeBox.anexos),
      usuarios_escrita: adminUsers,
      conteudo: JSON.parse(safeBox.conteudo),
      usuarios_escrita_deletado: usersAdminDeleted,
      usuarios_leitura_deletado: usersParticipantDeleted,
    });
  }, [safeBox, selectedUsers]);

  const handleRemoveUser = useCallback(
    (type: 'participant' | 'admin', email: string) => {
      let participantUsers = JSON.parse(safeBox.usuarios_leitura);
      let adminUsers = JSON.parse(safeBox.usuarios_escrita);
      let usersParticipantDeleted = JSON.parse(
        safeBox.usuarios_leitura_deletado
      );
      let usersAdminDeleted = JSON.parse(safeBox.usuarios_escrita_deletado);

      if (type === 'participant') {
        participantUsers = participantUsers.filter(
          (user: string) => user !== email
        );
        usersParticipantDeleted = [...usersParticipantDeleted, email];
      } else {
        adminUsers = adminUsers.filter((user: string) => user !== email);
        usersAdminDeleted = [...usersAdminDeleted, email];
      }

      updateUsersSafeBox({
        ...safeBox,
        id: safeBox._id,
        usuarios_leitura: participantUsers,
        usuarios_escrita: adminUsers,
        usuarios_escrita_deletado: usersAdminDeleted,
        usuarios_leitura_deletado: usersParticipantDeleted,
      });
    },
    [safeBox]
  );

  const handleAddSelectedUser = useCallback(
    ({ email, type }: IUserSelected) => {
      setSelectedUsers((state) => [...state, { email, type }]);
    },
    [selectedUsers]
  );

  const handleRemoveSelectedUser = useCallback(
    (email: string) => {
      setSelectedUsers((state) => state.filter((user) => user.email !== email));
    },
    [selectedUsers]
  );

  const updateSearchUserInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchUserInput(e.target.value);
    },
    []
  );

  return {
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
  };
}
