import axios from 'axios';
import { store } from '../../../main';
import { APIResponse, IToken } from '../../../types';
import { api } from '../../../util';
import { SafeBoxAPIModel, SafeBoxDatabaseModel } from '../model/SafeBox';
import { SafeBoxRepositoryAPIInterface } from './safe-box-repository-api-interface';
import { DeleteSafeBoxAPI } from './types';
import * as types from './types';

export class SafeBoxRepositoryAPI implements SafeBoxRepositoryAPIInterface {
  listSafeBoxesDeleted(arg0: {
    organizationId: string;
    authorization: typeof import('../../auth/repositories/auth-repository-api').AuthRepositoryAPI;
    date: number;
  }) {
    throw new Error('Method not implemented.');
  }

  async create(
    data: Omit<SafeBoxAPIModel, 'id'>,
    authorization: string
  ): Promise<APIResponse> {
    const create = await axios
      .post(
        `${api}/cofre/`,
        {
          usuarios_leitura: data.usuarios_leitura,
          usuarios_escrita: data.usuarios_escrita,
          conteudo: data.conteudo,
          tipo: data.tipo,
          nome: data.nome,
          descricao: data.descricao,
          organizacao: data.organizacao,
          criptografia: data.criptografia,
          anexos: data.anexos,
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
        console.log(error, 'API ERROR CREATE SAFE BOX');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
    return create;
  }

  async getSafeBoxById({
    organizationId,
    authorization,
    safeBoxId,
  }: types.IGetSafeBoxByIdData) {
    return axios
      .get(`${api}/cofre/`, {
        headers: {
          Authorization: authorization,
        },
        params: {
          organizacao: organizationId,
          id: safeBoxId,
        },
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERROR API GET SAFE BOX');
        return {
          status: error.response.status,
          data: error.response,
        };
      });
  }

  async delete(data: DeleteSafeBoxAPI): Promise<APIResponse> {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    return axios
      .delete(`${api}/cofre/`, {
        headers: {
          Authorization: authorization,
        },
        params: {
          organizacao: data.organizationId,
          id: data.safeBoxId,
        },
      })
      .then(async (result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' API DELETE SAFE BOX ERROR');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async update(data: types.IUpdateSafeBoxData, authorization: string) {
    return axios
      .put(
        `${api}/cofre/`,
        {
          id: data.id,
          usuarios_leitura: data.usuarios_leitura,
          usuarios_escrita: data.usuarios_escrita,
          usuarios_escrita_deletado: data.usuarios_escrita_deletado,
          usuarios_leitura_deletado: data.usuarios_leitura_deletado,
          conteudo: data.conteudo,
          tipo: data.tipo,
          nome: data.nome,
          descricao: data.descricao,
          organizacao: data.organizacao,
          criptografia: 'rsa',
          anexos: [],
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
        console.log(error, 'API ERROR CREATE SAFE BOX');
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }

  async list({
    organizationId,
    authorization,
    date,
  }: types.IListSafeBoxesData) {
    return axios
      .get(`${api}/cofre/list`, {
        headers: {
          Authorization: authorization,
        },
        params: {
          organizacao: organizationId,
          data: date,
        },
      })
      .then((result) => {
        return {
          status: result.status,
          data: result.data,
        };
      })
      .catch((error) => {
        console.log(error, ' ERROR API LIST SAFE BOX');
        return {
          status: error.response.status,
          data: error.response,
        };
      });
  }

  async listDeleted({
    organizationId,
    authorization,
    date,
  }: types.IListSafeBoxesDeletedData) {
    return axios
      .get(`${api}/cofre/list_deleted`, {
        headers: {
          Authorization: authorization,
        },
        params: {
          data: date,
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
        return {
          status: error.response.status,
          data: error.response.statusText,
        };
      });
  }
}
