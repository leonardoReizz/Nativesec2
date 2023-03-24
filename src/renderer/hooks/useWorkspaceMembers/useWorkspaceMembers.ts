import {
  addParticipantOrganizationIPC,
  removeInviteOrganizationIPC,
  removeUserOrganizationIPC,
} from '@/renderer/services/ipc/Organization';
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

export function useWorkspaceMembers() {
  const { loading, updateLoading } = useLoading();
  const { theme } = useUserConfig();
  const [input, setInput] = useState<string>('');

  const { currentOrganization, isParticipant } = useOrganization();

  const changeInput = useCallback((value: string) => {
    setInput(value);
  }, []);

  const filteredGuestAdmin = JSON.parse(
    currentOrganization?.convidados_administradores || '[]'
  ).filter((user: string) => user.toLowerCase().includes(input));
  const filteredGuestParticipant = JSON.parse(
    currentOrganization?.convidados_participantes || '[]'
  ).filter((user: string) => user.toLowerCase().includes(input));
  const filteredAdmin = JSON.parse(
    currentOrganization?.administradores || '[]'
  ).filter((user: string) => user.toLowerCase().includes(input));
  const filteredParticipant = JSON.parse(
    currentOrganization?.participantes || '[]'
  ).filter((user: string) => user.toLowerCase().includes(input));

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
      addParticipantOrganizationIPC({
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
        removeUserOrganizationIPC({
          organizationId: currentOrganization._id,
          email: currentUserDelete?.email,
          type: currentUserDelete?.type,
        });
      } else {
        removeInviteOrganizationIPC({
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

  function handleDropDown(value: any, email: string) {
    console.log(value);
    if (value === 'remove') {
      setCurrentUserDelete({ email, type: value });
      setIsOpenVerifyNameModal(true);
    } else if (currentOrganization) {
      toast.loading('Alterando usuario', {
        ...toastOptions,
        toastId: 'organizationChangeUser',
      });

      if (value === 'admin' || value === 'participant') {
        removeUserOrganizationIPC({
          email,
          organizationId: currentOrganization._id,
          type: value === 'admin' ? 'participant' : 'admin',
          changeUser: true,
        });
      } else {
        removeInviteOrganizationIPC({
          email,
          organizationId: currentOrganization?._id,
          type: value === 'guestAdmin' ? 'guestParticipant' : 'guestAdmin',
          changeUser: true,
        });
      }
    }
  }

  const optionsOwner = [
    {
      id: '1',
      name: 'Dono',
      items: [
        {
          value: 'owner',
          text: 'Dono',
        },
      ],
    },
  ];

  const optionsRadixUser = [
    {
      id: '1',
      name: 'Permissão',
      items: [
        {
          value: 'participant',
          text: 'Apenas Leitura',
        },
        {
          value: 'admin',
          text: 'Leitura e Escrita',
        },
      ],
    },
    {
      id: '2',
      name: 'Usuario',
      items: [
        {
          value: 'remove',
          text: 'Remover',
        },
      ],
    },
  ];

  const optionsRadixInvite = [
    {
      id: '1',
      name: 'Permissão',
      items: [
        {
          value: 'guestParticipant',
          text: 'Apenas Leitura',
        },
        {
          value: 'guestAdmin',
          text: 'Leitura e Escrita',
        },
      ],
    },
    {
      id: '2',
      name: 'Usuario',
      items: [
        {
          value: 'remove',
          text: 'Remover',
        },
      ],
    },
  ];

  return {
    handleDropDown,
    remove,
    addUser,
    isOpenVerifyNameModal,
    isOpenFieldModal,
    handleAddParticipant,
    handleCloseVerifyNameModal,
    handleCloseFieldModal,
    currentUserDelete,
    options,
    currentOrganization,
    filteredAdmin,
    filteredGuestAdmin,
    filteredGuestParticipant,
    filteredParticipant,
    changeInput,
    isParticipant,
    loading,
    theme,
    optionsOwner,
    optionsRadixUser,
    optionsRadixInvite,
  };
}
