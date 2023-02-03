import { IPCTypes } from '../../../renderer/@types/IPCTypes';
import apiSafeBox from '../../API/safeBox/index';
import DBSafeBox from '../../database/safebox/index';
import { store } from '../../main';
import * as types from './types';
import { ISafeBox } from './types';
import { ISafeBoxDatabase, IToken } from '../organizations/types';
import { UseIPCData } from '..';

export async function refreshSafeBoxes(arg: UseIPCData) {
  let safeBoxResponse;
  const { accessToken, tokenType } = store.get('token') as IToken;
  let lastDateUpdatedSafeBox = 1638290571;

  const listDBSafeBox = await DBSafeBox.listSafeBox({
    organizationId: arg.data.organizationId,
  });

  if (listDBSafeBox.length > 0) {
    const updateDate = listDBSafeBox.map((safeBox) => {
      if (safeBox.data_atualizacao) {
        return safeBox.data_atualizacao;
      }
      return 0;
    });

    lastDateUpdatedSafeBox = Math.max(...updateDate);

    if (!lastDateUpdatedSafeBox) {
      lastDateUpdatedSafeBox = 1638290571;
    }
  }
  // lastDate com error
  const listAPISafeBox = await apiSafeBox.listSafeBox({
    organizationId: arg.data.organizationId,
    authorization: `${tokenType} ${accessToken}`,
    date: lastDateUpdatedSafeBox + 1,
  });

  const listAPISafeBoxesDeleted = await apiSafeBox.listSafeBoxesDeleted({
    organizationId: arg.data.organizationId,
    authorization: `${tokenType} ${accessToken}`,
    date: lastDateUpdatedSafeBox - 604800,
  });

  const filterListAPISafeBox = listAPISafeBox?.data?.msg?.filter(
    (dbSafeBox: ISafeBox) => {
      return !listAPISafeBoxesDeleted?.data?.msg.some(
        (deletedSafeBox: ISafeBox) => {
          return dbSafeBox._id.$oid == deletedSafeBox._id.$oid;
        }
      );
    }
  );
  console.log(listAPISafeBox?.data?.msg, ' LIST API SAFE BOX');
  console.log(listAPISafeBoxesDeleted?.data?.msg, ' DELETED SAFE BOXES');

  const listToCreate = filterListAPISafeBox.filter((safebox: ISafeBox) => {
    return !listDBSafeBox.some((dbSafeBox: ISafeBoxDatabase) => {
      return dbSafeBox._id === safebox._id.$oid;
    });
  });

  const listToUpdate = listDBSafeBox.filter((dbSafeBox) => {
    return filterListAPISafeBox.some((safebox: ISafeBox) => {
      return dbSafeBox._id === safebox._id.$oid;
    });
  });

  if (listToUpdate.length > 0) {
    safeBoxResponse = true;
    const safeBoxInfo: ISafeBox[] = await Promise.all(
      listToUpdate.map(async (safebox) => {
        const APIGetSafeBox = await apiSafeBox.getSafeBox({
          authorization: `${tokenType} ${accessToken}`,
          safeBoxId: safebox._id,
          organizationId: arg.data.organizationId,
        });

        return APIGetSafeBox?.data?.msg[0];
      })
    );

    await Promise.all(
      safeBoxInfo.map(async (safebox: ISafeBox) => {
        return DBSafeBox.updateSafeBox({
          newSafeBox: {
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
            id: safebox._id.$oid,
          },
        });
      })
    );
  }

  if (listToCreate.length > 0) {
    safeBoxResponse = true;
    const safeBoxInfo: ISafeBox[] = await Promise.all(
      listToCreate.map(async (safebox: ISafeBox) => {
        const APIGetSafeBox = await apiSafeBox.getSafeBox({
          authorization: `${tokenType} ${accessToken}`,
          safeBoxId: safebox._id.$oid,
          organizationId: arg.data.organizationId,
        });

        return APIGetSafeBox?.data?.msg[0];
      })
    );

    await Promise.all(
      safeBoxInfo.map(async (safebox: ISafeBox) => {
        return DBSafeBox.createSafeBox({
          safeBox: {
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
            id: safebox._id.$oid,
          },
        });
      })
    );
  }

  if (
    listAPISafeBox.status === 401 &&
    listAPISafeBox.data?.msg === 'Unauthorized'
  ) {
    store.clear();
    store.set('initialData', {});
    return {
      response: 'leave-response',
      data: {
        type: 'sessionExpired',
      },
    };
  }

  const dbListSafeBox = await DBSafeBox.listSafeBox({
    organizationId: arg.data.organizationId,
  });
  store.set('safebox', dbListSafeBox);

  return {
    response: IPCTypes.REFRESH_SAFEBOXES_RESPONSE,
    data: {
      safeBoxResponse,
    },
  };
}

const safeBox = [
  {
    async getSafeBoxes(event: Electron.IpcMainEvent, arg: types.IGetSafeBox) {
      const dbGetAllSafeBox = await DBSafeBox.listSafeBox({
        organizationId: arg.organizationId,
      });

      store.set('safebox', dbGetAllSafeBox);
      event.reply(IPCTypes.GET_SAFE_BOXES_RESPONSE, {});
    },
  },
  {
    async getSafeBox(event: Electron.IpcMainEvent, arg: types.IGetSafeBox[]) {
      const listDBSafeBox = await DBSafeBox.getSafeBox({
        organizationId: arg[0].organizationId,
        safeBoxId: arg[0].safeBoxId,
      });

      event.reply('getSafeBox-response', {
        safeBox: listDBSafeBox,
      });
    },
  },
  {
    async deleteSafeBox(
      event: Electron.IpcMainEvent,
      arg: types.IDeleteSafeBox
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;

      const del = await apiSafeBox.deleteSafeBox({
        authorization: `${tokenType} ${accessToken}`,
        organizationId: arg.organizationId,
        safeBoxId: arg.safeBoxId,
      });

      if (del.status === 200 && del?.data?.status === 'ok') {
        const dbDel = await DBSafeBox.deleteSafeBox({
          safeBoxId: arg.safeBoxId,
        });
        if (dbDel !== true) {
          return event.reply('deleteSafeBox-response', {
            status: del.status,
            data: del.data,
          });
        }
      }

      const getDBSafeBox = await DBSafeBox.listSafeBox({
        organizationId: arg.organizationId,
      });

      store.set('safebox', getDBSafeBox);

      return event.reply('deleteSafeBox-response', {
        status: del.status,
        data: del.data,
        deletedId: arg.safeBoxId,
      });
    },
  },
];

export default safeBox;
