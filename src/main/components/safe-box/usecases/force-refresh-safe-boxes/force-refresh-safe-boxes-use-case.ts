import { store } from '@/main/main';
import { IToken } from '@/main/types';
import { refreshSafeBoxes } from '../../electron-store/store';
import { SafeBoxAPIModel } from '../../model/SafeBox';
import { SafeBoxRepositoryAPI } from '../../repositories/safe-box-repository-api';
import { SafeBoxRepositoryDatabase } from '../../repositories/safe-box-repository-database';
import { IForceRefreshSafeBoxesRequestDTO } from './IForceRefreshSafeBoxesRequestDTO';

export class ForceRefreshSafeBoxesUseCase {
  constructor(
    private safeBoxRepositoryDatabase: SafeBoxRepositoryDatabase,
    private safeBoxRepositoryAPI: SafeBoxRepositoryAPI
  ) {}

  async execute(data: IForceRefreshSafeBoxesRequestDTO) {
    const deleteSafeBoxes =
      await this.safeBoxRepositoryDatabase.deleteByOrganizationId(
        data.organizationId
      );

    if (deleteSafeBoxes instanceof Error)
      throw new Error('ERROR DATABASE DELETE SAFEBOXES -> FORCE REFRESH');

    const lastDateUpdatedSafeBox = 1;
    const { tokenType, accessToken } = store.get('token') as IToken;
    const authorization = `${tokenType} ${accessToken}`;

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

    const filterListToCreate = filterListAPISafeBox.filter(
      (safebox: SafeBoxAPIModel) => {
        return listAPISafeBoxesDeleted?.data?.msg.filter(
          (safeBoxDeleted: SafeBoxAPIModel) => {
            return safeBoxDeleted._id.$oid === safebox._id.$oid;
          }
        );
      }
    );

    if (filterListToCreate.length > 0) {
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

    await refreshSafeBoxes(data.organizationId);

    return { message: 'ok', data: { organizationId: data.organizationId } };
  }
}
