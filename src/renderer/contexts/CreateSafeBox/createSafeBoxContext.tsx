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
import { useSafeBox } from '@/renderer/hooks/useSafeBox/useSafeBox';
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
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const { currentOrganization } = useContext(OrganizationsContext);
  const { submitSafeBox } = useSafeBox();
  const [usersSelected, setUsersSelected] = useState<IUsersSelected[]>([]);
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
      const currentUsers = usersSelected.map((user) => {
        return {
          ...user,
          added: false,
        };
      });
      updateUsersSelected(currentUsers);
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
