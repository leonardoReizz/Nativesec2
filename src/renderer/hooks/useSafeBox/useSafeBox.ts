import { IPCTypes } from '@/types/IPCTypes';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import formik from 'renderer/utils/Formik/formik';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { useLoading } from '../useLoading';
import { useOrganization } from '../useOrganization/useOrganization';
import * as types from './types';

export function useSafeBox() {
  const [searchValue, setSearchValue] = useState<string>('');
  const { currentOrganization } = useOrganization();
  const safeBoxContext = useContext(SafeBoxesContext);
  const createSafeBox = useContext(CreateSafeBoxContext);
  const navigate = useNavigate();
  const { updateForceLoading } = useLoading();

  const isSafeBoxParticipant =
    JSON.parse(safeBoxContext.currentSafeBox?.usuarios_leitura || '[]').filter(
      (user: string) => user === window.electron.store.get('user').email
    ).length > 0;

  useEffect(() => {
    if (
      createSafeBox.changeUsersAdmin &&
      createSafeBox.changeUsersParticipant &&
      safeBoxContext.currentSafeBox === undefined &&
      safeBoxContext.safeBoxMode !== 'create'
    ) {
      createSafeBox.changeUsersAdmin([]);
      createSafeBox.changeUsersParticipant([]);
    }
  }, [safeBoxContext.safeBoxMode]);

  useEffect(() => {
    if (
      safeBoxContext?.currentSafeBox === undefined &&
      createSafeBox.changeUsersParticipant &&
      createSafeBox.changeUsersAdmin
    ) {
      createSafeBox.changeUsersParticipant([]);
      createSafeBox.changeUsersAdmin([]);
    }
  }, [safeBoxContext.currentSafeBox]);

  const filteredSafeBoxes = safeBoxContext.safeBoxes?.filter(
    (safebox) =>
      safebox.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
      safebox.descricao.toLowerCase().includes(searchValue.toLowerCase())
  );

  function submitSafeBox({
    formikProps,
    usersAdmin,
    usersParticipant,
    formikIndex,
    currentOrganizationId,
  }: types.ICreateSafeBox) {
    toast.loading('Salvando...', { ...toastOptions, toastId: 'saveSafeBox' });
    const { email } = window.electron.store.get('user') as IUser;
    const size = formikProps.values.length;
    const content = [];
    for (let i = 1; i < size - 1; i += 1) {
      content.push({
        [formikProps.values[i]?.name as string]:
          formikProps.values[i][`${formikProps.values[i].name}`],
        crypto: formikProps.values[i].crypto,
        name: formikProps.values[i].name,
      });
    }

    let editUsersAdmin = usersAdmin;
    let editUsersParticipant = usersParticipant;

    const filterUsersAdmin = usersAdmin.filter((user) => user === email);
    const filterUsersParticipant = usersParticipant.filter(
      (user) => user === email
    );

    let deletedUsersAdmin: string[] = JSON.parse(
      safeBoxContext.currentSafeBox?.usuarios_escrita_deletado || '[]'
    );
    let deletedUsersParticipant: string[] = JSON.parse(
      safeBoxContext.currentSafeBox?.usuarios_leitura_deletado || '[]'
    );

    if (safeBoxContext.currentSafeBox) {
      deletedUsersAdmin = JSON.parse(
        safeBoxContext.currentSafeBox.usuarios_escrita
      ).filter((user: string) => {
        return !editUsersAdmin.some((userAdmin) => {
          return userAdmin === user;
        });
      });
      deletedUsersAdmin = deletedUsersAdmin.filter((deletedUser) => {
        return ![...editUsersParticipant, ...editUsersAdmin].some((users) => {
          return users === deletedUser;
        });
      });

      deletedUsersParticipant = JSON.parse(
        safeBoxContext.currentSafeBox.usuarios_leitura
      ).filter((user: string) => {
        return !editUsersParticipant.some((userParticipant) => {
          return userParticipant === user;
        });
      });
      deletedUsersParticipant = deletedUsersParticipant.filter(
        (deletedUser) => {
          return ![...editUsersParticipant, ...editUsersAdmin].some((users) => {
            return users === deletedUser;
          });
        }
      );
    }

    if (
      filterUsersAdmin.length === 0 &&
      filterUsersParticipant.length === 0 &&
      editUsersAdmin.length === 0
    ) {
      deletedUsersAdmin = deletedUsersAdmin.filter((user) => user !== email);
      editUsersAdmin = [...editUsersAdmin, email];
      editUsersParticipant = editUsersParticipant.filter(
        (user) => user !== email
      );
    }

    if (safeBoxContext.safeBoxMode === 'create') {
      if (!editUsersAdmin.filter((user) => user !== email).length) {
        editUsersAdmin = [...editUsersAdmin, email];
      }

      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.CREATE_SAFE_BOX,
        data: {
          usuarios_leitura: editUsersParticipant,
          usuarios_escrita: editUsersAdmin,
          tipo: formik[formikIndex].type,
          usuarios_leitura_deletado: [],
          usuarios_escrita_deletado: [],
          criptografia: 'rsa',
          nome: formikProps.values[0][`${formikProps.values[0].name}`],
          descricao:
            formikProps.values[size - 1][
              `${formikProps.values[size - 1].name}`
            ],
          conteudo: content,
          organizacao: currentOrganizationId,
        },
      });
    } else {
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.UPDATE_SAFE_BOX,
        data: {
          id: safeBoxContext.currentSafeBox?._id,
          usuarios_leitura: editUsersParticipant,
          usuarios_escrita: editUsersAdmin,
          usuarios_leitura_deletado: deletedUsersParticipant,
          usuarios_escrita_deletado: deletedUsersAdmin,
          tipo: formik[formikIndex].type,
          criptografia: 'rsa',
          nome: formikProps.values[0][`${formikProps.values[0].name}`],
          descricao:
            formikProps.values[size - 1][
              `${formikProps.values[size - 1].name}`
            ],
          conteudo: content,
          organizacao: currentOrganizationId,
          data_atualizacao: safeBoxContext.currentSafeBox?.data_atualizacao,
          data_hora_create: safeBoxContext.currentSafeBox?.data_hora_create,
        },
      });
    }
  }

  function updateUsersSafeBox(email: string, newType: 'admin' | 'participant') {
    toast.loading('Atualizando usuarios', {
      ...toastOptions,
      toastId: 'updateSafeBox',
    });
    const { currentSafeBox } = safeBoxContext;

    if (currentSafeBox) {
      let usersAdmin: string[] = JSON.parse(currentSafeBox.usuarios_escrita);
      let usersParticipant: string[] = JSON.parse(
        currentSafeBox.usuarios_leitura
      );
      if (newType === 'admin') {
        usersParticipant = usersParticipant.filter((user) => user !== email);
        usersAdmin = [...usersAdmin, email];
      } else {
        usersAdmin = usersAdmin.filter((user) => user !== email);
        usersParticipant = [...usersParticipant, email];
      }

      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.UPDATE_USERS_SAFE_BOX,
        data: {
          id: currentSafeBox._id,
          usuarios_leitura: usersParticipant,
          usuarios_escrita: usersAdmin,
          usuarios_leitura_deletado: JSON.parse(
            currentSafeBox.usuarios_leitura_deletado
          ),
          usuarios_escrita_deletado: JSON.parse(
            currentSafeBox.usuarios_escrita_deletado
          ),
          tipo: currentSafeBox.tipo,
          anexos: currentSafeBox.anexos,
          criptografia: currentSafeBox.criptografia,
          nome: currentSafeBox.nome,
          descricao: currentSafeBox.descricao,
          conteudo: currentSafeBox.conteudo,
          organizacao: currentSafeBox.organizacao,
          data_atualizacao: currentSafeBox.data_atualizacao,
          data_hora_create: currentSafeBox.data_hora_create,
        },
      });
    }
  }

  function addSafeBoxUsers(safeBox: types.IUpdateSafeBoxData) {
    toast.loading('Atualizando Cofre', {
      ...toastOptions,
      toastId: 'updateSafeBox',
    });

    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.ADD_SAFE_BOX_USERS,
      data: {
        _id: safeBox._id,
        usuarios_leitura: safeBox.usuarios_leitura,
        usuarios_escrita: safeBox.usuarios_escrita,
        usuarios_leitura_deletado: safeBox.usuarios_leitura_deletado,
        usuarios_escrita_deletado: safeBox.usuarios_escrita_deletado,
        tipo: safeBox.tipo,
        criptografia: safeBox.criptografia,
        nome: safeBox.nome,
        descricao: safeBox.descricao,
        conteudo: safeBox.conteudo,
        organizacao: safeBox.organizacao,
        data_atualizacao: safeBoxContext.currentSafeBox?.data_atualizacao,
        data_hora_create: safeBoxContext.currentSafeBox?.data_hora_create,
      },
    });
  }

  const removeUser = useCallback(
    (data: types.IRemoveUserData) => {
      const { currentSafeBox } = safeBoxContext;
      if (currentSafeBox) {
        let usersAdmin = JSON.parse(currentSafeBox.usuarios_escrita);
        let usersParticipant = JSON.parse(currentSafeBox.usuarios_leitura);

        let usersAdminDeleted = JSON.parse(
          currentSafeBox.usuarios_escrita_deletado
        );
        let usersParticipantDeleted = JSON.parse(
          currentSafeBox.usuarios_leitura_deletado
        );

        if (data.type === 'admin') {
          usersAdminDeleted = [...usersAdminDeleted, data.email];
          usersAdmin = usersAdmin.filter((user: string) => user !== data.email);
        } else {
          usersParticipantDeleted = [...usersParticipantDeleted, data.email];
          usersParticipant = usersParticipant.filter(
            (user: string) => user !== data.email
          );
        }

        const user: types.IIPCUpdateUsersData = {
          id: currentSafeBox?._id,
          anexos: currentSafeBox.anexos,
          conteudo: currentSafeBox.conteudo,
          criptografia: currentSafeBox.criptografia,
          descricao: currentSafeBox.descricao,
          nome: currentSafeBox.nome,
          organizacao: currentSafeBox.organizacao,
          tipo: currentSafeBox.tipo,
          usuarios_escrita: usersAdmin,
          usuarios_escrita_deletado: usersAdminDeleted,
          usuarios_leitura: usersParticipant,
          usuarios_leitura_deletado: usersParticipantDeleted,
        };

        window.electron.ipcRenderer.sendMessage('useIPC', {
          event: IPCTypes.UPDATE_USERS_SAFE_BOX,
          data: user,
        });
      }
    },
    [safeBoxContext.currentSafeBox]
  );

  const changeSearchValue = useCallback(
    (newValue: string) => {
      setSearchValue(newValue);
    },
    [safeBoxContext.currentSafeBox]
  );

  function getSafeBoxes(organizationId: string) {
    safeBoxContext.changeSafeBoxesIsLoading(true);
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.LIST_SAFE_BOXES,
      data: {
        organizationId,
      },
    });
  }

  function deleteSafeBox({ organizationId, safeBoxId }: types.IDeleteSafeBox) {
    safeBoxContext.changeSafeBoxesIsLoading(true);
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.DELETE_SAFE_BOX,
      data: {
        organizationId,
        safeBoxId,
      },
    });
  }

  function decryptMessage({ text, itemName, position, copy }: types.IDecrypt) {
    if (
      safeBoxContext.currentSafeBox !== undefined &&
      JSON.parse(safeBoxContext.currentSafeBox.conteudo)[
        `${itemName}`
      ].startsWith('-----BEGIN PGP MESSAGE-----')
    ) {
      if (text.startsWith('*****')) {
        window.electron.ipcRenderer.sendMessage('useIPC', {
          event: IPCTypes.DECRYPT_TEXT,
          data: {
            message: JSON.parse(safeBoxContext.currentSafeBox.conteudo)[
              `${itemName}`
            ],
            itemName,
            position,
            copy,
          },
        });
      }
    }
  }

  function decrypt() {
    createSafeBox.formikProps.values.forEach((element: any, index: number) => {
      const message = JSON.parse(
        safeBoxContext.currentSafeBox?.conteudo as string
      )[`${createSafeBox.formikProps.values[index].name}`];
      if (message !== undefined) {
        if (message.startsWith('-----BEGIN PGP MESSAGE-----')) {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.DECRYPT_TEXT,
            data: {
              message,
              name: createSafeBox.formikProps.values[index].name,
              position: `${index}.${createSafeBox.formikProps.values[index].name}`,
            },
          });
        }
      }
    });
  }

  const forceRefreshSafeBoxes = useCallback((organizationId: string) => {
    updateForceLoading(true);
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.FORCE_REFRESH_SAFE_BOXES,
      data: { organizationId },
    });
  }, []);

  function changeCurrentSafeBox(safebox: ISafeBox | undefined) {
    navigate(`/workspace/${currentOrganization?._id}`);
    safeBoxContext.changeCurrentSafeBox(safebox);
  }

  return {
    ...createSafeBox,
    ...safeBoxContext,
    getSafeBoxes,
    isSafeBoxParticipant,
    deleteSafeBox,
    submitSafeBox,
    decrypt,
    decryptMessage,
    changeSearchValue,
    searchValue,
    removeUser,
    filteredSafeBoxes,
    addSafeBoxUsers,
    changeCurrentSafeBox,
    updateUsersSafeBox,
    forceRefreshSafeBoxes,
  };
}
