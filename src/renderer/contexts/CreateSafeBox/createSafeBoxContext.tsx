/* eslint-disable @typescript-eslint/no-use-before-define */
import { FormikContextType, useFormik } from 'formik';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toastOptions } from '@/renderer/utils/options/Toastify';
import { toast } from 'react-toastify';
import { IPCTypes } from '@/types/IPCTypes';
import formik from '../../utils/Formik/formik';
import { OrganizationsContext } from '../OrganizationsContext/OrganizationsContext';
import { SafeBoxesContext } from '../SafeBoxesContext/safeBoxesContext';
import * as types from './types';

interface CreateSafeBoxContextType {
  formikProps: FormikContextType<types.IFormikItem[]>;
  initialValues: types.IFormikItem;
  usersAdmin: string[];
  usersParticipant: string[];
  selectOptions: string[];
  formikIndex: number;
  usersSelected: IUsersSelected[];
  updateUsersSelected: (newSelected: IUsersSelected[]) => void;
  changeFormikIndex: (index: number) => void;
  changeSelectOptions: (users: string[]) => void;
  changeUsersAdmin: (users: string[]) => void;
  changeUsersParticipant: (users: string[]) => void;
  handleSubmit: () => void;
}

interface CreateSafeBoxContextProviderProps {
  children: ReactNode;
}

export interface IUsersSelected {
  email: string;
  type: 'admin' | 'participant';
  added: boolean;
}

export const CreateSafeBoxContext = createContext(
  {} as CreateSafeBoxContextType
);

export function CreateSafeBoxContextProvider({
  children,
}: CreateSafeBoxContextProviderProps) {
  const { currentSafeBox, safeBoxMode } = useContext(SafeBoxesContext);
  const { currentOrganization } = useContext(OrganizationsContext);
  const [usersSelected, setUsersSelected] = useState<IUsersSelected[]>([]);
  const [formikIndex, setFormikIndex] = useState<number>(0);
  const [usersParticipant, setUsersParticipant] = useState<string[]>([]);
  const [usersAdmin, setUsersAdmin] = useState<string[]>([]);
  const [selectOptions, setSelectOptions] = useState<string[]>([
    ...JSON.parse((currentOrganization?.administradores || '[]') as string).map(
      (adm: string) => {
        return { value: adm, label: adm };
      }
    ),
    ...JSON.parse((currentOrganization?.participantes || '[]') as string).map(
      (adm: string) => {
        return { value: adm, label: adm };
      }
    ),
    { value: currentOrganization?.dono, label: currentOrganization?.dono },
  ]);

  function getInitialValues() {
    return formik[formikIndex].item.map((item: types.IFormikItem) => {
      if (currentSafeBox !== undefined) {
        if (item.name === 'description') {
          item['description'] = currentSafeBox?.descricao;
        } else if (item.name === 'formName') {
          item['formName'] = currentSafeBox?.nome;
        } else {
          const safeBoxContent = JSON.parse(currentSafeBox?.conteudo as string);
          item[`${item.name}`] = safeBoxContent[`${item.name}`];
          if (item[`crypto`] !== undefined) {
            if (
              item[`${item.name}`]?.startsWith('-----BEGIN PGP MESSAGE-----')
            ) {
              item[`crypto`] = true;
              item[`${item.name}`] = '******************';
            } else {
              item[`crypto`] = false;
            }
          }
          if (item[`${item.name}`] === undefined) {
            item[`${item.name}`] = '';
          }
        }
      } else {
        item[`${item.name}`] = '';
      }

      return item;
    });
  }

  const initialValues = getInitialValues();

  function handleSubmit() {
    if (currentOrganization) {
      const currentUsers = usersSelected.map((user) => {
        return {
          ...user,
          added: false,
        };
      });
      updateUsersSelected(currentUsers);

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
            return ![...editUsersParticipant, ...editUsersAdmin].some(
              (users) => {
                return users === deletedUser;
              }
            );
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

      if (safeBoxMode === 'create') {
        if (editUsersAdmin.filter((user) => user !== email).length === 0) {
          editUsersAdmin = [email];
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
            organizacao: currentOrganization._id,
          },
        });
      } else {
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
            organizacao: currentOrganization._id,
            data_atualizacao: currentSafeBox?.data_atualizacao,
            data_hora_create: currentSafeBox?.data_hora_create,
          },
        });
      }
    }
  }

  const formikProps = useFormik({
    initialValues,
    onSubmit: () => handleSubmit(),
    enableReinitialize: true,
  });

  // useEffect(() => {
  //   const values = getInitialValues();
  //   formikProps.setValues(values);
  // }, [currentSafeBox, formikIndex]);

  function changeFormikIndex(index: number) {
    setFormikIndex(index);
  }

  function changeUsersAdmin(users: string[]) {
    setUsersAdmin(users);
  }

  function changeUsersParticipant(users: string[]) {
    setUsersParticipant(users);
  }

  function changeSelectOptions(users: string[]) {
    setSelectOptions(users);
  }

  const updateUsersSelected = useCallback((newSelected: IUsersSelected[]) => {
    setUsersSelected(newSelected);
  }, []);

  return (
    <CreateSafeBoxContext.Provider
      value={{
        formikIndex,
        formikProps: formikProps as unknown as FormikContextType<
          types.IFormikItem[]
        >,
        changeFormikIndex,
        initialValues,
        usersAdmin,
        updateUsersSelected,
        usersParticipant,
        changeUsersAdmin,
        usersSelected,
        changeUsersParticipant,
        changeSelectOptions,
        selectOptions,
        handleSubmit,
      }}
    >
      {children}
    </CreateSafeBoxContext.Provider>
  );
}
