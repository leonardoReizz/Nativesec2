import axios from 'axios';
import { APIResponse } from '../../../types';
import { api } from '../../../util';
import { IPrivateKeyApiModel, IPublicKeyApiModel } from '../model/Key';
import { KeyRepositoryAPIInterface } from './key-repository-api-interface';
import * as types from './types';

export class KeyRepositoryAPI implements KeyRepositoryAPIInterface {
  async createPrivateKey(
    data: IPrivateKeyApiModel,
    authorization: string
  ): Promise<APIResponse> {
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

  async createPublicKey(
    data: IPublicKeyApiModel,
    authorization: string
  ): Promise<APIResponse> {
    return axios
      .post(
        `${api}/privatekey/`,
        {
          chave: data.publicKey,
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

  async getPrivateKey(email: string, authorization: string) {
    return axios
      .get(`${api}/privatekey/`, {
        params: {
          email,
        },
        headers: {
          Authorization: authorization,
        },
      })
      .then(async (result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, 'ERROR API GET PRIVATE KEY');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async getPublicKey(
    email: string,
    authorization: string
  ): Promise<APIResponse> {
    return axios
      .get(`${api}/pubkey/`, {
        headers: {
          Authorization: authorization,
        },
        params: {
          email,
        },
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERROR API GET PUBLIC KEY');
        return {
          status: error.status,
          data: error.response.msg,
        };
      });
  }
}
