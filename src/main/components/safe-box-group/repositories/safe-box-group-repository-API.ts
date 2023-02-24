import { api } from '@/main/util';
import axios from 'axios';
import { ISafeBoxGroupRepositoryAPIInterface } from './safe-box-group-repository-API-interface';

export class SafeBoxGroupRepositoryAPI
  implements ISafeBoxGroupRepositoryAPIInterface
{
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
}
