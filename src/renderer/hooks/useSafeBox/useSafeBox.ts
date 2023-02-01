import { IUser } from 'main/types';
import { useCallback, useContext, useState } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { CreateSafeBoxContext } from 'renderer/contexts/CreateSafeBox/createSafeBoxContext';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import formik from 'renderer/utils/Formik/formik';
import * as types from './types';

export function useSafeBox() {
  const [searchValue, setSearchValue] = useState<string>('');
  const safeBoxContext = useContext(SafeBoxesContext);
  const createSafeBox = useContext(CreateSafeBoxContext);

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
    const { myEmail } = window.electron.store.get('user') as IUser;
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

    const filterUsersAdmin = usersAdmin.filter((user) => user === myEmail);
    const filterUsersParticipant = usersParticipant.filter(
      (user) => user === myEmail
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
      deletedUsersAdmin = deletedUsersAdmin.filter((user) => user !== myEmail);
      editUsersAdmin = [...editUsersAdmin, myEmail];
      editUsersParticipant = editUsersParticipant.filter(
        (email) => email !== myEmail
      );
    }
    if (safeBoxContext.safeBoxMode === 'create') {
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
      console.log({
        id: safeBoxContext.currentSafeBox?._id,
        usuarios_leitura: editUsersParticipant,
        usuarios_escrita: editUsersAdmin,
        usuarios_leitura_deletado: deletedUsersParticipant,
        usuarios_escrita_deletado: deletedUsersAdmin,
        tipo: formik[formikIndex].type,
        criptografia: 'rsa',
        nome: formikProps.values[0][`${formikProps.values[0].name}`],
        descricao:
          formikProps.values[size - 1][`${formikProps.values[size - 1].name}`],
        conteudo: content,
        organizacao: currentOrganizationId,
        data_atualizacao: safeBoxContext.currentSafeBox?.data_atualizacao,
        data_hora_create: safeBoxContext.currentSafeBox?.data_hora_create,
      });
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

  function updateUsers(data: types.IUpdateUsersData) {
    const { myEmail } = window.electron.store.get('user') as IUser;

    let filterUsersAdmin = data.usersAdmin.filter((user) => user === myEmail);
    let filterUsersParticipant = data.usersParticipant.filter(
      (user) => user === myEmail
    );

    if (safeBoxContext.currentSafeBox) {
      if (data.newType === 'admin') {
        filterUsersParticipant = filterUsersParticipant.filter(
          (user) => user === data.user
        );

        filterUsersAdmin.push(data.user);
      } else {
        filterUsersAdmin = filterUsersAdmin.filter(
          (user) => user === data.user
        );
        filterUsersParticipant.push(data.user);
      }

      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.UPDATE_SAFE_BOX,
        data: {
          id: safeBoxContext.currentSafeBox?._id,
          usuarios_leitura: filterUsersParticipant,
          usuarios_escrita: filterUsersAdmin,
          usuarios_leitura_deletado:
            safeBoxContext.currentSafeBox.usuarios_leitura_deletado,
          usuarios_escrita_deletado:
            safeBoxContext.currentSafeBox.usuarios_escrita_deletado,
          tipo: safeBoxContext.currentSafeBox.tipo,
          criptografia: 'rsa',
          nome: safeBoxContext.currentSafeBox.nome,
          descricao: safeBoxContext.currentSafeBox.descricao,
          conteudo: safeBoxContext.currentSafeBox.conteudo,
          organizacao: data.organizationId,
          data_atualizacao: safeBoxContext.currentSafeBox?.data_atualizacao,
          data_hora_create: safeBoxContext.currentSafeBox?.data_hora_create,
        },
      });
    }

    if (
      filterUsersAdmin.length === 0 &&
      filterUsersParticipant.length === 0 &&
      editUsersAdmin.length === 0
    ) {
      deletedUsersAdmin = deletedUsersAdmin.filter((user) => user !== myEmail);
      editUsersAdmin = [...editUsersAdmin, myEmail];
      editUsersParticipant = editUsersParticipant.filter(
        (email) => email !== myEmail
      );
    }
  }

  const changeSearchValue = useCallback((newValue: string) => {
    setSearchValue(newValue);
  }, []);

  function getSafeBoxes(organizationId: string) {
    safeBoxContext.changeSafeBoxesIsLoading(true);
    window.electron.ipcRenderer.sendMessage('getSafeBoxes', {
      organizationId,
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

  function decryptMessage({ text, itemName, position }: types.IDecrypt) {
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
  return {
    getSafeBoxes,
    deleteSafeBox,
    submitSafeBox,
    decrypt,
    decryptMessage,
    changeSearchValue,
    searchValue,
    filteredSafeBoxes,
    updateUsers,
    ...createSafeBox,
    ...safeBoxContext,
  };
}
