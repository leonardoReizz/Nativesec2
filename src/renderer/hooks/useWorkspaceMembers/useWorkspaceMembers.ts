import { toastOptions } from '@/renderer/utils/options/Toastify';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoading } from '../useLoading';
import { useOrganization } from '../useOrganization/useOrganization';
import { useUserConfig } from '../useUserConfig/useUserConfig';

interface ICurrentUserDelete {
  email: string;
  type: 'admin' | 'participant' | 'guestParticipant' | 'guestAdmin';
}

interface IAddUserData {
  email: string;
  type: {
    id: number;
    label: string;
    value: 'guestParticipant' | 'guestAdmin';
  };
}

const options = [
  { id: 1, value: 'guestParticipant', label: 'Participante' },
  { id: 2, value: 'guestAdmin', label: 'Administrador' },
];

const userOptions = [
  { id: 1, value: 'participant', label: 'Apenas Leitura' },
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

export function useWorkspaceMembers() {
  const { loading, updateLoading } = useLoading();
  const { theme } = useUserConfig();
  const {
    currentOrganization,
    addNewParticipant,
    removeUser,
    removeInvite,
    filteredAdmin,
    filteredGuestAdmin,
    filteredGuestParticipant,
    filteredParticipant,
    changeInput,
    isParticipant,
  } = useOrganization();

  const [currentUserDelete, setCurrentUserDelete] = useState<
    ICurrentUserDelete | undefined
  >();

  const [isOpenVerifyNameModal, setIsOpenVerifyNameModal] =
    useState<boolean>(false);
  const [isOpenFieldModal, setIsOpenFieldModal] = useState<boolean>(false);

  const handleCloseVerifyNameModal = useCallback(() => {
    setIsOpenVerifyNameModal(false);
  }, []);

  const handleCloseFieldModal = useCallback(() => {
    setIsOpenFieldModal(false);
  }, []);

  function handleAddParticipant() {
    setIsOpenFieldModal(true);
  }

  function addUser(user: IAddUserData) {
    if (currentOrganization) {
      addNewParticipant({
        type: user.type.value,
        email: user.email,
        organizationId: currentOrganization?._id,
      });
    }
  }

  function remove(verified: boolean) {
    if (verified && currentOrganization && currentUserDelete) {
      updateLoading(true);
      if (
        currentUserDelete.type === 'admin' ||
        currentUserDelete.type === 'participant'
      ) {
        removeUser({
          organizationId: currentOrganization._id,
          email: currentUserDelete?.email,
          type: currentUserDelete?.type,
        });
      } else {
        removeInvite({
          organizationId: currentOrganization._id,
          email: currentUserDelete?.email,
          type: currentUserDelete?.type,
        });
      }
    }
  }

  useEffect(() => {
    if (!loading) {
      setCurrentUserDelete(undefined);
      setIsOpenFieldModal(false);
      setIsOpenVerifyNameModal(false);
    }
  }, [loading]);

  function handleDropDown(user: any, type: any, email: string) {
    if (user.id === 3) {
      setCurrentUserDelete({ email, type });
      setIsOpenVerifyNameModal(true);
    } else if (currentOrganization) {
      toast.loading('Alterando usuario', {
        ...toastOptions,
        toastId: 'organizationChangeUser',
      });

      if (type === 'admin' || type === 'participant') {
        removeUser({
          email,
          organizationId: currentOrganization._id,
          type,
          changeUser: true,
        });
      } else {
        removeInvite({
          email,
          organizationId: currentOrganization?._id,
          type,
          changeUser: true,
        });
      }
    }
  }

  return {
    handleDropDown,
    remove,
    addNewParticipant,
    addUser,
    isOpenVerifyNameModal,
    isOpenFieldModal,
    handleAddParticipant,
    handleCloseVerifyNameModal,
    handleCloseFieldModal,
    currentUserDelete,
    options,
    userOptions,
    currentOrganization,
    filteredAdmin,
    filteredGuestAdmin,
    filteredGuestParticipant,
    filteredParticipant,
    changeInput,
    isParticipant,
    loading,
    theme,
  };
}
