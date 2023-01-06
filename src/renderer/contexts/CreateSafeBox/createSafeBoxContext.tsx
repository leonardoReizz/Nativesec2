/* eslint-disable @typescript-eslint/no-use-before-define */
import { FormikContextType, useFormik } from 'formik';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import formik from '../../utils/Formik/formik';
import { OrganizationsContext } from '../OrganizationsContext/OrganizationsContext';
import { SafeBoxesContext } from '../SafeBoxesContext/safeBoxesContext';
import {
  SafeBoxModeContext,
  SafeBoxModeType,
} from '../WorkspaceMode/SafeBoxModeContext';
import * as types from './types';

interface CreateSafeBoxContextType {
  formikProps: FormikContextType<types.IFormikItem[]>;
  initialValues: types.IFormikItem;
  usersAdmin: string[];
  usersParticipant: string[];
  selectOptions: string[];
  formikIndex: number;
  decrypt: () => void;
  changeFormikIndex: (index: number) => void;
  changeSelectOptions: (users: string[]) => void;
  changeUsersAdmin: (users: string[]) => void;
  changeUsersParticipant: (users: string[]) => void;
  handleSubmit: () => void;
}

interface CreateSafeBoxContextProviderProps {
  children: ReactNode;
}

export const CreateSafeBoxContext = createContext(
  {} as CreateSafeBoxContextType
);

export function CreateSafeBoxContextProvider({
  children,
}: CreateSafeBoxContextProviderProps) {
  const { safeBoxMode } = useContext(SafeBoxModeContext);
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const { currentOrganization } = useContext(OrganizationsContext);
  const { submitSafeBox } = useSafeBox();

  const [formikIndex, setFormikIndex] = useState<number>(0);
  const [usersParticipant, setUsersParticipant] = useState<string[]>([]);
  const [usersAdmin, setUsersAdmin] = useState<string[]>([]);
  const [selectOptions, setSelectOptions] = useState<string[]>([
    ...JSON.parse(currentOrganization?.administradores as string).map(
      (adm: string) => {
        return { value: adm, label: adm };
      }
    ),
    ...JSON.parse(currentOrganization?.participantes as string).map(
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

  let initialValues = getInitialValues();

  function handleSubmit() {
    if (currentOrganization) {
      submitSafeBox({
        formikProps: formikProps as unknown as FormikContextType<
          types.IFormikItem[]
        >,
        formikIndex,
        currentOrganizationId: currentOrganization._id,
        usersAdmin,
        usersParticipant,
      });
    }
  }

  function decrypt() {
    formikProps.values.forEach((element: any, index: number) => {
      const message = JSON.parse(currentSafeBox?.conteudo as string)[
        `${formikProps.values[index].name}`
      ];
      if (message !== undefined) {
        if (message.startsWith('-----BEGIN PGP MESSAGE-----')) {
          window.electron.ipcRenderer.sendMessage('useIPC', {
            event: IPCTypes.DECRYPT_TEXT,
            data: {
              message,
              name: formikProps.values[index].name,
              position: `${index}.${formikProps.values[index].name}`,
            },
          });
        }
      }
    });
  }

  const formikProps = useFormik({
    initialValues,
    onSubmit: () => handleSubmit(),
    enableReinitialize: true,
  });

  useEffect(() => {
    const values = getInitialValues();
    formikProps.setValues(values);
    initialValues = values;
  }, [currentSafeBox]);

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
        usersParticipant,
        changeUsersAdmin,
        changeUsersParticipant,
        changeSelectOptions,
        selectOptions,
        handleSubmit,
        decrypt,
      }}
    >
      {children}
    </CreateSafeBoxContext.Provider>
  );
}
