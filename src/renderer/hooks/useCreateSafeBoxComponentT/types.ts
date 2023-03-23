import { IFormikItem } from '@/renderer/contexts/CreateSafeBox/types';
import { FormikContextType } from 'formik';

export interface ICreateSafeBox {
  usersAdmin: string[];
  usersParticipant: string[];

  currentOrganizationId: string;
}
