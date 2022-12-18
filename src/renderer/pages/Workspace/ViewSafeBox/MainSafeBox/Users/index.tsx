import { useCallback, useContext, useState } from 'react';
import { MultiValue } from 'react-select';
import { MultiSelect } from 'renderer/components/Inputs/MultiSelect';
import { OrganizationsContext } from 'renderer/contexts/OrganizationsContext/OrganizationsContext';
import { IOrganization } from 'renderer/contexts/OrganizationsContext/types';
import { SafeBoxesContext } from 'renderer/contexts/SafeBoxesContext/safeBoxesContext';
import { ThemeContext } from 'renderer/contexts/ThemeContext/ThemeContext';
import { SafeBoxModeContext } from 'renderer/contexts/WorkspaceMode/SafeBoxModeContext';
import styles from './styles.module.sass';

interface IParticipant {
  email: string;
  type: 'participant' | 'admin';
  label: string;
  value: string;
}

interface UsersProps {
  formikIndex: number;
  usersAdmin: IParticipant[];
  usersParticipant: IParticipant[];
  selectOptions: IParticipant[];
  currentOrganization: IOrganization | undefined;
  changeUsersParticipant: (users: IParticipant[]) => void;
  changeUsersAdmin: (users: IParticipant[]) => void;
  changeSelectOptions: (users: IParticipant[]) => void;
}

export default function Users({
  formikIndex,
  usersAdmin,
  usersParticipant,
  selectOptions,
  currentOrganization,
  changeUsersAdmin,
  changeUsersParticipant,
  changeSelectOptions,
}: UsersProps) {
  const { safeBoxMode } = useContext(SafeBoxModeContext);
  const { theme } = useContext(ThemeContext);
  const { currentSafeBox } = useContext(SafeBoxesContext);
  const handleAddParticipant = useCallback(
    (values: MultiValue<IParticipant>, type: 'participant' | 'admin') => {
      const selectValues = values as IParticipant[];
      if (currentOrganization) {
        const selectInitialValues = [
          ...JSON.parse(currentOrganization.administradores).map(
            (email: string) => {
              return { value: email, label: email };
            }
          ),
          ...JSON.parse(currentOrganization.participantes).map(
            (email: string) => {
              return { value: email, label: email };
            }
          ),

          { value: currentOrganization.dono, label: currentOrganization.dono },
        ];

        if (type === 'admin') {
          if (values.length < usersAdmin.length) {
            const filterOptions = selectInitialValues.filter(
              (so) =>
                ![...selectValues, ...usersParticipant].filter(
                  (sv) => sv.label === so.label
                ).length
            );
            const filterSelected = selectInitialValues.filter(
              (so) => selectValues.filter((sv) => sv.label === so.label).length
            );
            changeUsersAdmin(filterSelected);
            changeSelectOptions(filterOptions);
            if (type === 'admin') {
              changeUsersAdmin(filterSelected);
            } else {
              changeUsersParticipant(filterSelected);
            }
          } else if (values.length > 0) {
            const filterOptions = selectOptions.filter(
              (so) => !selectValues.filter((sv) => sv.label === so.label).length
            );

            changeSelectOptions(filterOptions);
            changeUsersAdmin([
              ...usersAdmin,
              {
                email: values[values.length - 1].label,
                type,
                value: values[values.length - 1].label,
                label: values[values.length - 1].label,
              },
            ]);
          }
        } else if (type === 'participant') {
          if (values.length < usersParticipant.length) {
            const filterOptions = selectInitialValues.filter(
              (so) =>
                ![...selectValues, ...usersAdmin].filter(
                  (sv) => sv.label === so.label
                ).length
            );
            const filterSelected = selectInitialValues.filter(
              (so) => selectValues.filter((sv) => sv.label === so.label).length
            );
            changeUsersAdmin(filterSelected);
            changeSelectOptions(filterOptions);
          } else if (values.length > 0) {
            const filterOptions = selectOptions.filter(
              (so) => !selectValues.filter((sv) => sv.label === so.label).length
            );
            changeSelectOptions(filterOptions);
            changeUsersParticipant([
              ...usersParticipant,
              {
                email: values[values.length - 1].label,
                type,
                value: values[values.length - 1].label,
                label: values[values.length - 1].label,
              },
            ]);
          }
        }
      }
    },
    [
      changeSelectOptions,
      changeUsersAdmin,
      changeUsersParticipant,
      currentOrganization,
      selectOptions,
      usersAdmin,
      usersParticipant,
    ]
  );

  return (
    <div className={styles.users}>
      <MultiSelect
        value={usersParticipant}
        options={selectOptions}
        isDisable={currentSafeBox !== undefined && safeBoxMode !== 'edit'}
        onChange={handleAddParticipant}
        placeholder="Selecione um usuario"
        theme={theme}
      />
    </div>
  );
}
