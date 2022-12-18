/* eslint-disable @typescript-eslint/dot-notation */
import { useContext, useState } from 'react';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { FormikContextType, useFormik } from 'formik';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { IFormikItem } from '../types';
import { Form } from './Form';
import Users from './Users';
import styles from './styles.module.sass';

interface FormProps {
  currentSafeBox: ISafeBox | undefined;
  formikIndex: number;
  formikProps: FormikContextType<IFormikItem[]>;
  changeUsersParticipant: (users: IParticipant[]) => void;
  changeUsersAdmin: (users: IParticipant[]) => void;
  changeSelectOptions: (users: IParticipant[]) => void;
  usersParticipant: IParticipant[];
  usersAdmin: IParticipant[];
  selectOptions: IParticipant[];
}

export interface IParticipant {
  email: string;
  type: 'participant' | 'admin';
  label: string;
  value: string;
}

export function MainSafeBox({
  currentSafeBox,
  formikIndex,
  formikProps,
  changeSelectOptions,
  changeUsersAdmin,
  changeUsersParticipant,
  usersAdmin,
  usersParticipant,
  selectOptions,
}: FormProps) {
  const { currentOrganization } = useContext(OrganizationsContext);
  const [tab, setTab] = useState<'form' | 'users'>('form');

  function handleTabForm() {
    setTab('form');
  }
  function handleTabUsers() {
    setTab('users');
  }

  return (
    <div className={styles.mainSafeBox}>
      <div className={styles.menu}>
        <button
          type="button"
          onClick={handleTabForm}
          className={`${tab === 'form' ? styles.selected : ''}`}
        >
          Cofre
        </button>
        <button
          type="button"
          onClick={handleTabUsers}
          className={`${tab === 'users' ? styles.selected : ''}`}
        >
          Usuarios
        </button>
      </div>
      {tab === 'form' ? (
        <Form
          formikProps={
            formikProps as unknown as FormikContextType<IFormikItem[]>
          }
        />
      ) : (
        <Users
          formikIndex={formikIndex}
          currentOrganization={currentOrganization}
          usersAdmin={usersAdmin}
          usersParticipant={usersParticipant}
          selectOptions={selectOptions}
          changeUsersParticipant={changeUsersParticipant}
          changeUsersAdmin={changeUsersAdmin}
          changeSelectOptions={changeSelectOptions}
        />
      )}
    </div>
  );
}
