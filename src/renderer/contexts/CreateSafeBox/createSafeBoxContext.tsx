/* eslint-disable @typescript-eslint/no-use-before-define */
import { FormikContextType, useFormik } from 'formik';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useSafeBox } from 'renderer/hooks/useSafeBox/useSafeBox';
import formik from '../../utils/Formik/formik';
import { OrganizationsContext } from '../OrganizationsContext/OrganizationsContext';
import { SafeBoxesContext } from '../SafeBoxesContext/safeBoxesContext';
import * as types from './types';

interface CreateSafeBoxContextType {
  formikProps: FormikContextType<types.IFormikItem[]>;
  initialValues: types.IFormikItem;
  usersAdmin: types.IParticipant[];
  usersParticipant: types.IParticipant[];
  selectOptions: types.IParticipant[];
  formikIndex: number;
  changeFormikIndex: (index: number) => void;
  changeSelectOptions: (users: types.IParticipant[]) => void;
  changeUsersAdmin: (users: types.IParticipant[]) => void;
  changeUsersParticipant: (users: types.IParticipant[]) => void;
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
  const { createSafeBox } = useSafeBox();
  const [formikIndex, setFormikIndex] = useState<number>(0);
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const { currentOrganization } = useContext(OrganizationsContext);

  const [usersParticipant, setUsersParticipant] = useState<
    types.IParticipant[]
  >([]);
  const [usersAdmin, setUsersAdmin] = useState<types.IParticipant[]>([]);
  const [selectOptions, setSelectOptions] = useState<types.IParticipant[]>([
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

  const initialValues = formik[formikIndex].item.map(
    (item: types.IFormikItem) => {
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
    }
  );

  function handleSubmit() {
    if (currentOrganization) {
      createSafeBox({
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

  function changeFormikIndex(index: number) {
    setFormikIndex(index);
  }

  function changeUsersAdmin(users: types.IParticipant[]) {
    setUsersParticipant(users);
  }

  function changeUsersParticipant(users: types.IParticipant[]) {
    setUsersParticipant(users);
  }

  function changeSelectOptions(users: types.IParticipant[]) {
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
      }}
    >
      {children}
    </CreateSafeBoxContext.Provider>
  );
}
