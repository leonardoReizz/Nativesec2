import { IToken } from '../../../../types';
import { store } from '../../../../main';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxAPIModel, SafeBoxDatabaseModel } from '../../model/SafeBox';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IRefreshSafeBoxesRequestDTO } from './refresh-safe-boxes-request-dto';

export class RefreshSafeBoxesUseCase {
  constructor(
    private safeBoxRepositoryAPI: SafeBoxRepositoryAPI,
    private safeBoxRepositoryDatabase: SafeBoxRepositoryDatabase
  ) {}

  async execute(data: IRefreshSafeBoxesRequestDTO, lastDate?: number) {
    let lastDateUpdatedSafeBox = 1638290571;
    let safeBoxResponse = false;
    const { tokenType, accessToken } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

    const listDBSafeBox = await this.safeBoxRepositoryDatabase.list(
      data.organizationId
    );

    if (listDBSafeBox.length > 0) {
      const updateDate = listDBSafeBox.map((safeBox) => {
        if (safeBox.data_atualizacao) {
          return Number(safeBox.data_atualizacao);
        }
        return 0;
      });

      lastDateUpdatedSafeBox = Math.max(...updateDate);

      if (!lastDateUpdatedSafeBox) {
        lastDateUpdatedSafeBox = 1638290571;
      }
    }

    if (lastDate) {
      lastDateUpdatedSafeBox = lastDate;
    }

    const listAPISafeBox = await this.safeBoxRepositoryAPI.list({
      organizationId: data.organizationId,
      authorization,
      date: lastDateUpdatedSafeBox + 1,
    });

    const listAPISafeBoxesDeleted = await this.safeBoxRepositoryAPI.listDeleted(
      {
        organizationId: data.organizationId,
        authorization,
        date: lastDateUpdatedSafeBox - 604800,
      }
    );

    const filterListAPISafeBox = (listAPISafeBox?.data as any)?.msg.filter(
      (dbSafeBox: SafeBoxAPIModel) => {
        return !listAPISafeBoxesDeleted?.data?.msg.some(
          (deletedSafeBox: SafeBoxAPIModel) => {
            return dbSafeBox._id.$oid == deletedSafeBox._id.$oid;
          }
        );
      }
    );

    const listToCreate = filterListAPISafeBox.filter(
      (safebox: SafeBoxAPIModel) => {
        return !listDBSafeBox.some((dbSafeBox: SafeBoxDatabaseModel) => {
          return dbSafeBox._id === safebox._id.$oid;
        });
      }
    );

    const filterListToCreate = listToCreate.filter(
      (safebox: SafeBoxAPIModel) => {
        return listAPISafeBoxesDeleted?.data?.msg.filter(
          (safeBoxDeleted: SafeBoxAPIModel) => {
            return safeBoxDeleted._id.$oid === safebox._id.$oid;
          }
        );
      }
    );

    const listToUpdate = listDBSafeBox.filter((dbSafeBox) => {
      return filterListAPISafeBox.some((safebox: SafeBoxAPIModel) => {
        return dbSafeBox._id === safebox._id.$oid;
      });
    });

    const filterListToUpdate = listToUpdate.filter((dbSafeBox) => {
      return listAPISafeBoxesDeleted?.data?.msg.filter(
        (safeBoxDeleted: SafeBoxAPIModel) => {
          return dbSafeBox._id === safeBoxDeleted._id.$oid;
        }
      );
    });

    let listToDelete: SafeBoxAPIModel[] = [];

    if (listAPISafeBoxesDeleted.data?.msg.length > 0) {
      listToDelete = listAPISafeBoxesDeleted?.data?.msg.filter(
        (safebox: SafeBoxAPIModel) => {
          return listDBSafeBox.filter((dbSafeBox) => {
            return dbSafeBox._id === safebox._id.$oid;
          });
        }
      );
    }

    if (filterListToUpdate.length > 0) {
      safeBoxResponse = true;
      const safeBoxInfo: SafeBoxAPIModel[] = await Promise.all(
        filterListToUpdate.map(async (safebox) => {
          const APIGetSafeBox = await this.safeBoxRepositoryAPI.getSafeBoxById({
            authorization,
            safeBoxId: safebox._id,
            organizationId: data.organizationId,
          });

          return APIGetSafeBox?.data?.msg[0];
        })
      );

      await Promise.all(
        safeBoxInfo.map(async (safebox: SafeBoxAPIModel) => {
          await this.safeBoxRepositoryDatabase.update({
            ...safebox,
            anexos: JSON.stringify(safebox.anexos),
            data_atualizacao: safebox.data_atualizacao.$date,
            usuarios_escrita_deletado: JSON.stringify(
              safebox.usuarios_escrita_deletado
            ),
            usuarios_leitura_deletado: JSON.stringify(
              safebox.usuarios_leitura_deletado
            ),
            usuarios_escrita: JSON.stringify(safebox.usuarios_escrita),
            usuarios_leitura: JSON.stringify(safebox.usuarios_leitura),
            _id: safebox._id.$oid,
          });
        })
      );
    }

    if (filterListToCreate.length > 0) {
      safeBoxResponse = true;
      const safeBoxInfo: SafeBoxAPIModel[] = await Promise.all(
        filterListToCreate.map(async (safebox: SafeBoxAPIModel) => {
          const APIGetSafeBox = await this.safeBoxRepositoryAPI.getSafeBoxById({
            authorization,
            safeBoxId: safebox._id.$oid,
            organizationId: data.organizationId,
          });

          return APIGetSafeBox?.data?.msg[0];
        })
      );

      await Promise.all(
        safeBoxInfo.map(async (safebox: SafeBoxAPIModel) => {
          await this.safeBoxRepositoryDatabase.create({
            ...safebox,
            anexos: JSON.stringify(safebox.anexos),
            data_hora_create: safebox.data_hora_create.$date,
            data_atualizacao: safebox.data_atualizacao.$date,
            usuarios_escrita_deletado: JSON.stringify(
              safebox.usuarios_escrita_deletado
            ),
            usuarios_leitura_deletado: JSON.stringify(
              safebox.usuarios_leitura_deletado
            ),
            usuarios_escrita: JSON.stringify(safebox.usuarios_escrita),
            usuarios_leitura: JSON.stringify(safebox.usuarios_leitura),
            _id: safebox._id.$oid,
          });
        })
      );
    }

    if (listToDelete.length > 0) {
      safeBoxResponse = true;
      await Promise.all(
        listToDelete.map(async (safeBoxDelete: SafeBoxAPIModel) => {
          await this.safeBoxRepositoryDatabase.delete(safeBoxDelete._id.$oid);
        })
      );
    }

    await refreshSafeBoxes(data.organizationId);

    return { message: 'ok', data: { safeBoxResponse } };
  }
}
