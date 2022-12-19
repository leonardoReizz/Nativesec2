import { FormikContextType } from 'formik';
import {
  IFormikItem,
  IParticipant,
} from 'renderer/contexts/CreateSafeBox/types';

export interface IDeleteSafeBox {
  organizationId: string;
  safeBoxId: string;
}

export interface ICreateSafeBox {
  formikProps: FormikContextType<IFormikItem[]>;
  usersAdmin: IParticipant[];
  usersParticipant: IParticipant[];
  formikIndex: number;
  currentOrganizationId: string;
}

export interface IDecrypt {
  text: string;
  itemName: string;
  position: string;
}
