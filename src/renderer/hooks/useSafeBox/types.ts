import { FormikContextType } from 'formik';
import { IFormikItem } from 'renderer/contexts/CreateSafeBox/types';

export interface IDeleteSafeBox {
  organizationId: string;
  safeBoxId: string;
}

export interface ICreateSafeBox {
  formikProps: FormikContextType<IFormikItem[]>;
  usersAdmin: string[];
  usersParticipant: string[];
  formikIndex: number;
  currentOrganizationId: string;
}

export interface IDecrypt {
  text: string;
  itemName: string;
  position: string;
  copy?: boolean;
}

export interface IUpdateUsersData {
  usersAdmin: string[];
  usersParticipant: string[];
  user: string;
  organizationId: string;
  newType: 'admin' | 'participant';
}
