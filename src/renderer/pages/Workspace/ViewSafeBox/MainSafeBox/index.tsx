/* eslint-disable @typescript-eslint/dot-notation */
import { useCallback, useContext, useState } from 'react';
import { ISafeBox } from 'renderer/contexts/SafeBoxesContext/types';
import { useFormik } from 'formik';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import styles from './styles.module.sass';
import formik from '../formik';
import { IFormikItem } from '../types';
import { Form } from './Form';
import Users from './Users';

interface FormProps {
  currentSafeBox: ISafeBox | undefined;
  formikIndex: number;
}

export interface IParticipant {
  email: string;
  type: 'participant' | 'admin';
  label: string;
  value: string;
}

export function MainSafeBox({ currentSafeBox, formikIndex }: FormProps) {
  const { currentOrganization } = useContext(OrganizationsContext);
  const [tab, setTab] = useState<'form' | 'users'>('form');
  const [usersParticipant, setUsersParticipant] = useState<IParticipant[]>([]);
  const [usersAdmin, setUsersAdmin] = useState<IParticipant[]>([]);
  const [selectOptions, setSelectOptions] = useState<IParticipant[]>([
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

  const initialValues = formik[formikIndex].item.map((item: IFormikItem) => {
    if (currentSafeBox !== undefined) {
      if (item.name === 'description') {
        item['description'] = currentSafeBox?.descricao;
      } else if (item.name === 'formName') {
        item['formName'] = currentSafeBox?.nome;
      } else {
        const safeBoxContent = JSON.parse(currentSafeBox?.conteudo as string);
        item[`${item.name}`] = safeBoxContent[`${item.name}`];
        if (item[`crypto`] !== undefined) {
          if (item[`${item.name}`]?.startsWith('-----BEGIN PGP MESSAGE-----')) {
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

  const changeUsersParticipant = useCallback((users: IParticipant[]) => {
    setUsersParticipant(users);
  }, []);

  const changeUsersAdmin = useCallback((users: IParticipant[]) => {
    setUsersAdmin(users);
  }, []);

  const changeSelectOptions = useCallback((users: IParticipant[]) => {
    setSelectOptions(users);
  }, []);

  function handleSubmit(values: typeof initialValues) {
    console.log(values);
  }

  const formikProps = useFormik({
    initialValues,
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true,
  });

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
        <Form formikProps={formikProps} />
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
