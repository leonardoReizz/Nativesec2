import axios from 'axios';
import { api } from '@/main/util';

import { ISafeBoxGroupRepositoryAPIInterface } from './safe-box-group-repository-API-interface';
import * as t from './types';
import { ISafeBoxGroupModelAPI } from '../model/safe-box-group';

export class SafeBoxGroupRepositoryAPI
  implements ISafeBoxGroupRepositoryAPIInterface
{

  async create(
    data: Omit<ISafeBoxGroupModelAPI, 'data_hora_create'| 'data_atualizacao'|  '_id' | 'dono'>, authorization: string
  ): Promise<APIResponse> {
    return axios
      .post(
        `${api}/grupo/`,
        {
          ...data
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
        console.log(error, 'API ERROR CREATE SAFE BOX GROUP');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }
  async list(
    organizationId: string,
    authorization: string
  ): Promise<APIResponse> {
    return axios
      .get(`${api}/grupo/list`, {
        headers: {
          Authorization: authorization,
        },
        params: {
          organizacao: organizationId,
        },
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERROR API LIST SAFE BOX GROUP');
        return {
          status: error.response.status,
          data: error.response,
        };
      });
  }

  async update(
    data: t.IUpdateSafeBoxGroupAPIData,
    authorization: string
  ): Promise<APIResponse> {
    return axios
      .put(
        `${api}/grupo/`,
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
        console.log(error, ' ERROR API UPDATE SAFE BOX GROUP');
        return {
          status: error.response.status,
          data: error.response,
        };
      });
  }

  async delete(
    data: t.IDeleteSafeBoxGroupAPI,
    authorization: string
  ): Promise<APIResponse> {
    return axios
      .delete(`${api}/grupo/`, {
        headers: {
          Authorization: authorization,
        },
        params: {
          id: data.safeBoxGroupId,
          organizacao: data.organizationId,
        },
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERROR API DELETE SAFE BOX GROUP');
        return {
          status: error.response.status,
          data: error.response,
        };
      });
  }
}
