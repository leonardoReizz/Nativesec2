import { IOrganization } from 'renderer/contexts/OrganizationsContext/types';

export interface CreateOrganizationResponse {
  message: 'ok' | 'nok';
  organization: IOrganization;
}
