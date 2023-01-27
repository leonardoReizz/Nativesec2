/* eslint-disable class-methods-use-this */
import axios from 'axios';
import { ICreateOrganization, IToken } from 'main/ipc/organizations/types';
import { APIResponse } from '../../../types';
import { api } from '../../../util';
import { store } from '../../../main';
import APIOrganization from '../../../API/organizations';
import { IOrganizationRepositoryAPI } from './organization-repository-api-interface';
import * as types from './types';

export class OrganizationRepositoryAPI implements IOrganizationRepositoryAPI {
  async create(organization: ICreateOrganization): Promise<APIResponse> {
    const { accessToken, tokenType } = store.get('token') as IToken;

    const APICreateOrganization = await APIOrganization.createOrganization({
      data: organization,
      authorization: `${tokenType} ${accessToken}`,
    });

    return {
      status: APICreateOrganization.status,
      data: APICreateOrganization.data,
    };
  }

  async inviteParticipant(data: types.InviteParticipantData): Promise<any> {
    return axios
      .post(
        `${api}/organizacao/invitation/participant/?id=${data.organizationId}&user=${data.email}`,
        {},
        {
          headers: {
            Authorization: data.authorization,
          },
        }
      )
      .then(async (result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERRO API ORGANIZATION INVITE PARTICIPANT');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async inviteAdmin(data: types.InviteAdminData): Promise<APIResponse> {
    return axios
      .post(
        `${api}/organizacao/invitation/admin/?id=${data.organizationId}&user=${data.email}`,
        {},
        {
          headers: {
            Authorization: data.authorization,
          },
        }
      )
      .then(async (result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERRO API ORGANIZATION INVITE PARTICIPANT');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async delete(organizationId: string): Promise<APIResponse> {
    const { accessToken, tokenType } = store.get('token') as IToken;

    return axios
      .delete(`${api}/organizacao/`, {
        headers: {
          Authorization: `${tokenType} ${accessToken}`,
        },
        params: {
          id: organizationId,
        },
      })
      .then(async (result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERRO API DELETE ORGANIZATION');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async update(
    data: types.IUpdateData,
    authorization: string
  ): Promise<APIResponse> {
    return axios
      .put(
        `${api}/organizacao/`,
        {
          ...data,
        },
        {
          headers: {
            Authorization: authorization,
          },
        }
      )
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERRO API UPDATE ORGANIZATION');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async removeParticipant(
    data: types.IRemoveParticipantData
  ): Promise<APIResponse> {
    return axios
      .delete(`${api}/organizacao/user/participant/`, {
        headers: {
          Authorization: data.authorization,
        },
        params: {
          id: data.organizationId,
          user: data.email,
        },
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERROR API DELETE PARTICIPANT ORGANIZATION');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async removeAdmin(data: types.IRemoveAdminData): Promise<APIResponse> {
    return axios
      .delete(`${api}/organizacao/user/admin/`, {
        headers: {
          Authorization: data.authorization,
        },
        params: {
          id: data.organizationId,
          user: data.email,
        },
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERROR API DELETE PARTICIPANT ORGANIZATION');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }
}
