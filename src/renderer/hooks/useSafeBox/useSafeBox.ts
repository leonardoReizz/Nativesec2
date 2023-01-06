import { IUser } from 'main/types';
import { useContext } from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import formik from 'renderer/utils/Formik/formik';
import * as types from './types';

export function useSafeBox() {
  const { changeSafeBoxesIsLoading, currentSafeBox } =
    useContext(SafeBoxesContext);

  const { safeBoxMode } = useContext(SafeBoxModeContext);

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
      currentSafeBox?.usuarios_escrita_deletado || '[]'
    );
    let deletedUsersParticipant: string[] = JSON.parse(
      currentSafeBox?.usuarios_leitura_deletado || '[]'
    );

    if (currentSafeBox) {
      deletedUsersAdmin = JSON.parse(currentSafeBox.usuarios_escrita).filter(
        (user: string) => {
          return !editUsersAdmin.some((userAdmin) => {
            return userAdmin === user;
          });
        }
      );
      deletedUsersAdmin = deletedUsersAdmin.filter((deletedUser) => {
        return ![...editUsersParticipant, ...editUsersAdmin].some((users) => {
          return users === deletedUser;
        });
      });

      deletedUsersParticipant = JSON.parse(
        currentSafeBox.usuarios_leitura
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
    if (safeBoxMode === 'create') {
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
        id: currentSafeBox?._id,
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
        data_atualizacao: currentSafeBox?.data_atualizacao,
        data_hora_create: currentSafeBox?.data_hora_create,
      });
      window.electron.ipcRenderer.sendMessage('useIPC', {
        event: IPCTypes.UPDATE_SAFE_BOX,
        data: {
          id: currentSafeBox?._id,
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
          data_atualizacao: currentSafeBox?.data_atualizacao,
          data_hora_create: currentSafeBox?.data_hora_create,
        },
      });
    }
  }
  function getSafeBoxes(organizationId: string) {
    changeSafeBoxesIsLoading(true);
    window.electron.ipcRenderer.sendMessage('getSafeBoxes', {
      organizationId,
    });
  }

  function deleteSafeBox({ organizationId, safeBoxId }: types.IDeleteSafeBox) {
    changeSafeBoxesIsLoading(true);
    window.electron.ipcRenderer.sendMessage('useIPC', {
      event: IPCTypes.DELETE_SAFE_BOX,
      data: {
        organizationId,
        safeBoxId,
      },
    });
  }

  function decrypt({ text, itemName, position }: types.IDecrypt) {
    if (
      currentSafeBox !== undefined &&
      JSON.parse(currentSafeBox.conteudo)[`${itemName}`].startsWith(
        '-----BEGIN PGP MESSAGE-----'
      )
    ) {
      if (text.startsWith('*****')) {
        window.electron.ipcRenderer.sendMessage(IPCTypes.DECRYPT_TEXT, {
          message: JSON.parse(currentSafeBox.conteudo)[`${itemName}`],
          // itemName,
          // position,
        });
      }
    }
  }

  return { getSafeBoxes, deleteSafeBox, submitSafeBox, decrypt };
}
