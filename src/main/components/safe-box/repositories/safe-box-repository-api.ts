import axios from 'axios';
import { store } from '../../../main';
import { APIResponse, IToken } from '../../../types';
import { api } from '../../../util';
import { SafeBoxAPIModel, SafeBoxDatabaseModel } from '../model/SafeBox';
import { SafeBoxRepositoryAPIInterface } from './safe-box-repository-api-interface';
import { DeleteSafeBoxAPI } from './types';
import * as types from './types';

export class SafeBoxRepositoryAPI implements SafeBoxRepositoryAPIInterface {
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
}
