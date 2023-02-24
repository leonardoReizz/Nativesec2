import { OrganizationModelDatabase } from '@/main/components/organizations/model/Organization';
import { store } from '@/main/main';
import { IPCError } from '@/main/utils/IPCError';
import {
  ISafeBoxGroupModelAPI,
  ISafeBoxGroupModelDatabase,
} from '../../model/safe-box-group';
import { SafeBoxGroupRepositoryAPI } from '../../repositories/safe-box-group-repository-API';
import { SafeBoxGroupRepositoryDatabase } from '../../repositories/safe-box-group-repository-database';

export class RefreshAllSafeBoxGroupUseCase {
  constructor(
    private safeBoxGroupRepositoryAPI: SafeBoxGroupRepositoryAPI,
    private safeBoxGroupRepositoryDatabase: SafeBoxGroupRepositoryDatabase
  ) {}

  async execute() {
    const { accessToken, tokenType } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    const organizations = store.get(
      'organizations'
    ) as OrganizationModelDatabase[];

    let listSafeBoxGroupDatabase =
      await this.safeBoxGroupRepositoryDatabase.list();

    IPCError({
      object: listSafeBoxGroupDatabase,
      message: 'ERROR DATABASE LIST SAFE BOX GROUP',
    });

    // listar no banco
    // listar na api

    // map banco -> if banco e api e data diferente atualiza, tira da lista da api
    // map banco -> if nao tem 

    await Promise.all(
      organizations.map(async (organization) => {
        const listSafeBoxGroupAPI = await this.safeBoxGroupRepositoryAPI.list(
          organization._id,
          authorization
        );

        IPCError({
          object: listSafeBoxGroupAPI,
          message: 'ERROR API LIST SAFE BOX GROUP',
        });

        const listSafeBoxGroup = listSafeBoxGroupAPI.data
          .msg as ISafeBoxGroupModelAPI[];

        listSafeBoxGroup.map((safeboxGroupAPI) => {
          const filter = (<ISafeBoxGroupModelDatabase[]>(
            listSafeBoxGroupDatabase
          )).filter(
            (safeboxGroupDB) => safeboxGroupDB._id === safeboxGroupAPI._id.$oid
          );

          if (filter.length) {
            if (
              filter[0].data_atualizacao !==
              safeboxGroupAPI.data_atualizacao.$date
            ) {
              // update
            }
          } else {
            // create
          }

          listSafeBoxGroupDatabase = (<ISafeBoxGroupModelDatabase[]>(
            listSafeBoxGroupDatabase
          )).filter(
            (safeboxGroupDB) =>
              safeboxGroupDB._id !== safeboxGroupAPI._id.$oid
          );
        });


        listSafeBoxGroup.map((safeboxGroupAPI) => {
          const filter = (<ISafeBoxGroupModelDatabase[]>(
            listSafeBoxGroupDatabase
          )).filter(
            (safeboxGroupDB) => safeboxGroupDB._id === safeboxGroupAPI._id.$oid
          );

          if(!filter.length {
            // create
          })
        })

        // const createSafeBoxGroupDatabase =
        //   await this.safeBoxGroupRepositoryDatabase.create({
        //     _id: groupCreated._id.$oid,
        //     cofres: JSON.stringify(groupCreated.cofres),
        //     data_atualizacao: groupCreated.data_atualizacao.$date,
        //     data_hora_create: groupCreated.data_hora_create.$date,
        //     descricao: groupCreated.descricao,
        //     dono: groupCreated.dono,
        //     nome: groupCreated.nome,
        //     organizacao: groupCreated.organizacao,
        //   });

        IPCError({
          object: createSafeBoxGroupDatabase,
          message: 'ERROR API LIST SAFE BOX GROUP',
        });

        return {
          message: 'ok',
        };
      })
    );
  }
}
