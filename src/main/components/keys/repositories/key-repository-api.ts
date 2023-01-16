import axios from 'axios';
import { APIResponse } from '../../../types';
import { api } from '../../../util';
import { KeyAPI } from '../model/Key';
import { KeyRepositoryAPIInterface } from './key-repository-api-interface';

export class KeyRepositoryAPI implements KeyRepositoryAPIInterface {
  async create(data: KeyAPI, authorization: string): Promise<APIResponse> {
    return axios
      .post(
        `${api}/privatekey/`,
        {
          chave: data.privateKey,
          tipo: 'rsa',
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
        console.log(error, ' ERROR API CREATE PRIVATE KEY');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async delete(data: KeyAPI, authorization: string): Promise<APIResponse> {
    return axios
      .delete(`${api}/privatekey/`, {
        data: {
          chave: data.privateKey,
          tipo: data.type,
        },
        headers: {
          Authorization: authorization,
        },
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, 'ERROR API DELETE PRIVATE KEY');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }
}
