/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useContext } from 'react';

import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { FormikContextType, useFormik } from 'formik';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { IUser } from 'main/types';
import formik from './formik';
import styles from './styles.module.sass';
import { IParticipant, MainSafeBox } from './MainSafeBox';
import { HeaderSafeBox } from './HeaderSafeBox';
import { IFormikItem } from './types';

export function ViewSafeBox() {
  const { currentOrganization } = useContext(OrganizationsContext);

  const { safeBoxMode, changeSafeBoxMode } = useContext(SafeBoxModeContext);
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const [formikIndex, setFormikIndex] = useState<number>(0);

  function handleSubmit(values: typeof initialValues) {
    console.log(values);
  }

  function changeFormikIndex(index: number) {
    setFormikIndex(index);
  }
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

  const formikProps = useFormik({
    initialValues,
    onSubmit: (values) => handleSubmit(values),
    enableReinitialize: true,
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

  const createSafeBox = useCallback(() => {
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

    let editUsersAdmin = usersAdmin.map((user) => user.label);
    let editUsersParticipant = usersParticipant.map((user) => user.label);

    const filterUsersAdmin = usersAdmin.filter(
      (user) => user.label === myEmail
    );
    const filterUsersParticipant = usersParticipant.filter(
      (user) => user.label === myEmail
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
          formikProps.values[size - 1][`${formikProps.values[size - 1].name}`],
        conteudo: content,
        organizacao: currentOrganization?._id,
      },
    });
  }, [formikProps]);

  useEffect(() => {
    if (currentSafeBox) {
      const index = formik.findIndex((item) => {
        return item.type === currentSafeBox.tipo;
      });
      setFormikIndex(index);
      changeSafeBoxMode('view');
    }
  }, [currentSafeBox]);

  return (
    <div className={styles.currentSafeBox}>
      <HeaderSafeBox
        currentSafeBox={currentSafeBox}
        formikIndex={formikIndex}
        changeFormikIndex={changeFormikIndex}
        createSafeBox={createSafeBox}
      />
      <main>
        <MainSafeBox
          currentSafeBox={currentSafeBox}
          formikIndex={formikIndex}
          formikProps={
            formikProps as unknown as FormikContextType<IFormikItem[]>
          }
          changeUsersParticipant={changeUsersParticipant}
          changeUsersAdmin={changeUsersAdmin}
          changeSelectOptions={changeSelectOptions}
          usersParticipant={usersParticipant}
          usersAdmin={usersAdmin}
          selectOptions={selectOptions}
        />
      </main>
    </div>
  );
}
