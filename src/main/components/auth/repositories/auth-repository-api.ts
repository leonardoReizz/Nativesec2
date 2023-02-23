import axios from 'axios';
import { api } from '../../../util';
import { APIResponse } from '../../../types';
import { IAuthRepositoryAPI } from './auth-repository-api-interface';
import * as types from './types';

export class AuthRepositoryAPI implements IAuthRepositoryAPI {
  async login(data: types.ILoginData): Promise<APIResponse> {
    return axios
      .post(`${api}/auth/login`, {
        email: data.email,
        password: data.password,
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, 'ERROR API AUTH LOGIN');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async refreshToken(authorization: string): Promise<APIResponse> {
    return axios
      .get(`${api}/auth/token`, {
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
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async generateToken(email: string): Promise<APIResponse> {
    return axios
      .get(`${api}/auth/password`, {
        params: { email },
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERROR API AUTH PASSWORD');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }
}
