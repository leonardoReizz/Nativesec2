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
      type: 'database',
    });

    await Promise.all(
      organizations.map(async (organization) => {
        let listSafeBoxGroupAPI: any =
          await this.safeBoxGroupRepositoryAPI.list(
            organization._id,
            authorization
          );

        IPCError({
          object: listSafeBoxGroupAPI,
          message: 'ERROR API LIST SAFE BOX GROUP',
          type: 'api',
        });

        listSafeBoxGroupAPI = listSafeBoxGroupAPI.data.msg;

        listSafeBoxGroupAPI.map(
          async (safeboxGroupAPI: ISafeBoxGroupModelAPI) => {
            const filter = (<ISafeBoxGroupModelDatabase[]>(
              listSafeBoxGroupDatabase
            )).filter(
              (safeboxGroupDB) =>
                safeboxGroupDB._id === safeboxGroupAPI._id.$oid
            );

            if (filter.length) {
              if (
                filter[0].data_atualizacao !==
                safeboxGroupAPI.data_atualizacao.$date
              ) {
                const updateSafeBoxGroup =
                  await this.safeBoxGroupRepositoryDatabase.update({
                    ...safeboxGroupAPI,
                    _id: safeboxGroupAPI._id.$oid,
                    data_atualizacao: safeboxGroupAPI.data_atualizacao.$date,
                    cofres: JSON.stringify(safeboxGroupAPI.cofres),
                  });

                IPCError({
                  object: updateSafeBoxGroup,
                  message: 'ERROR DATABASE DELETE SAFE BOX GROUP',
                  type: 'database',
                });
              }
            } else {
              const createSafeBoxGroup =
                await this.safeBoxGroupRepositoryDatabase.create({
                  ...safeboxGroupAPI,
                  _id: safeboxGroupAPI._id.$oid,
                  data_atualizacao: safeboxGroupAPI.data_atualizacao.$date,
                  data_hora_create: safeboxGroupAPI.data_hora_create.$date,
                  cofres: JSON.stringify(safeboxGroupAPI.cofres),
                });

              IPCError({
                object: createSafeBoxGroup,
                message: 'ERROR DATABASE DELETE SAFE BOX GROUP',
                type: 'database',
              });
            }

            listSafeBoxGroupDatabase = (<ISafeBoxGroupModelDatabase[]>(
              listSafeBoxGroupDatabase
            )).filter(
              (safeboxGroupDB) =>
                safeboxGroupDB._id !== safeboxGroupAPI._id.$oid
            );
          }
        );

        (<ISafeBoxGroupModelDatabase[]>listSafeBoxGroupDatabase).map(
          async (safeboxGroupDatabase) => {
            const deleteSafeBoxGroup =
              await this.safeBoxGroupRepositoryDatabase.deleteById(
                safeboxGroupDatabase._id
              );

            IPCError({
              object: deleteSafeBoxGroup,
              message: 'ERROR DATABASE DELETE SAFE BOX GROUP',
              type: 'database',
            });
          }
        );
      })
    );

    return {
      message: 'ok',
    };
  }
}
