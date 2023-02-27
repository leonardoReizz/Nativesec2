import { store } from '@/main/main';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxAPIModel } from '../../model/SafeBox';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IRefreshSafeBoxesRequestDTO } from './refresh-safe-boxes-request-dto';

export class RefreshSafeBoxesUseCase {
  constructor(
    private safeBoxRepositoryAPI: SafeBoxRepositoryAPI,
    private safeBoxRepositoryDatabase: SafeBoxRepositoryDatabase
  ) {}

  async execute(data: IRefreshSafeBoxesRequestDTO, lastDate?: number) {
    const { tokenType, accessToken } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;
    let lastDateUpdatedSafeBox = 1638290571;
    const safeBoxResponse = false;

    let listDBSafeBox = await this.safeBoxRepositoryDatabase.list(
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

    const apiSafeBoxesDeleted = listAPISafeBoxesDeleted.data
      .msg as SafeBoxAPIModel[];
    let apiSafeBoxes = [...listAPISafeBox.data.msg] as SafeBoxAPIModel[];

    await Promise.all(
      apiSafeBoxesDeleted.map(async (safebox) => {
        if (
          listDBSafeBox.filter(
            (safeboxDB) => safeboxDB._id === safebox._id.$oid
          ).length
        ) {
          await this.safeBoxRepositoryDatabase.delete(safebox._id.$oid);
          apiSafeBoxes = apiSafeBoxes.filter(
            (safeboxAPI) => safeboxAPI._id.$oid !== safebox._id.$oid
          );
        }
      })
    );

    await Promise.all(
      apiSafeBoxes.map(async (safeboxAPI) => {
        const safeboxFilter = listDBSafeBox.filter(
          (safeboxDB) => safeboxAPI._id.$oid === safeboxDB._id
        );
        if (safeboxFilter.length) {
          if (
            safeboxFilter[0].data_atualizacao !==
            safeboxAPI.data_atualizacao.$date
          ) {
            await this.safeBoxRepositoryDatabase.update({
              ...safeboxFilter[0],
              anexos: JSON.stringify(safeboxAPI.anexos),
              data_atualizacao: safeboxAPI.data_atualizacao.$date,
              usuarios_escrita_deletado: JSON.stringify(
                safeboxAPI.usuarios_escrita_deletado
              ),
              usuarios_leitura_deletado: JSON.stringify(
                safeboxAPI.usuarios_leitura_deletado
              ),
              usuarios_escrita: JSON.stringify(safeboxAPI.usuarios_escrita),
              usuarios_leitura: JSON.stringify(safeboxAPI.usuarios_leitura),
              _id: safeboxAPI._id.$oid,
            });
          }
        } else {
          await this.safeBoxRepositoryDatabase.create({
            ...safeboxAPI,
            anexos: JSON.stringify(safeboxAPI.anexos),
            data_hora_create: safeboxAPI.data_hora_create.$date,
            data_atualizacao: safeboxAPI.data_atualizacao.$date,
            usuarios_escrita_deletado: JSON.stringify(
              safeboxAPI.usuarios_escrita_deletado
            ),
            usuarios_leitura_deletado: JSON.stringify(
              safeboxAPI.usuarios_leitura_deletado
            ),
            usuarios_escrita: JSON.stringify(safeboxAPI.usuarios_escrita),
            usuarios_leitura: JSON.stringify(safeboxAPI.usuarios_leitura),
            _id: safeboxAPI._id.$oid,
          });
        }

        listDBSafeBox = listDBSafeBox.filter(
          (safeboxDB) => safeboxAPI._id.$oid !== safeboxDB._id
        );
      })
    );

    await refreshSafeBoxes(data.organizationId);

    return {
      message: 'ok',
      data: { safeBoxResponse, safeBoxId: data.safeBoxId },
    };
  }
}
