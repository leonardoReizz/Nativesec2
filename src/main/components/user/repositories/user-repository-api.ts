import axios from 'axios';
import { api } from '../../../util';
import { APIResponse } from '../../../types';
import { UserRepositoryApiInterface } from './user-repository-api-interface';

export class UserRepositoryAPI implements UserRepositoryApiInterface {
  async getUser(authorization: string): Promise<APIResponse> {
    return axios
      .get(`${api}/user/`, {
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
        console.log(error, ' ERRO API GET USER');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }
}
