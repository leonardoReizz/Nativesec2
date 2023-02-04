import { IPCTypes } from '../../../renderer/@types/IPCTypes';
import { UseIPCData } from '..';

export async function refreshSafeBoxes(arg: UseIPCData) {
  // let safeBoxResponse;
  // const { accessToken, tokenType } = store.get('token') as IToken;
  // let lastDateUpdatedSafeBox = 1638290571;

  // const listDBSafeBox = await DBSafeBox.listSafeBox({
  //   organizationId: arg.data.organizationId,
  // });

  // if (listDBSafeBox.length > 0) {
  //   const updateDate = listDBSafeBox.map((safeBox) => {
  //     if (safeBox.data_atualizacao) {
  //       return safeBox.data_atualizacao;
  //     }
  //     return 0;
  //   });

  //   lastDateUpdatedSafeBox = Math.max(...updateDate);

  //   if (!lastDateUpdatedSafeBox) {
  //     lastDateUpdatedSafeBox = 1638290571;
  //   }
  // }
  // // lastDate com error
  // const listAPISafeBox = await apiSafeBox.listSafeBox({
  //   organizationId: arg.data.organizationId,
  //   authorization: `${tokenType} ${accessToken}`,
  //   date: lastDateUpdatedSafeBox + 1,
  // });

  // const listAPISafeBoxesDeleted = await apiSafeBox.listSafeBoxesDeleted({
  //   organizationId: arg.data.organizationId,
  //   authorization: `${tokenType} ${accessToken}`,
  //   date: lastDateUpdatedSafeBox - 604800,
  // });

  // const filterListAPISafeBox = listAPISafeBox?.data?.msg?.filter(
  //   (dbSafeBox: ISafeBox) => {
  //     return !listAPISafeBoxesDeleted?.data?.msg.some(
  //       (deletedSafeBox: ISafeBox) => {
  //         return dbSafeBox._id.$oid == deletedSafeBox._id.$oid;
  //       }
  //     );
  //   }
  // );
  // console.log(listAPISafeBox?.data?.msg, ' LIST API SAFE BOX');
  // console.log(listAPISafeBoxesDeleted?.data?.msg, ' DELETED SAFE BOXES');

  // const listToCreate = filterListAPISafeBox.filter((safebox: ISafeBox) => {
  //   return !listDBSafeBox.some((dbSafeBox: ISafeBoxDatabase) => {
  //     return dbSafeBox._id === safebox._id.$oid;
  //   });
  // });

  // const listToUpdate = listDBSafeBox.filter((dbSafeBox) => {
  //   return filterListAPISafeBox.some((safebox: ISafeBox) => {
  //     return dbSafeBox._id === safebox._id.$oid;
  //   });
  // });

  // if (listToUpdate.length > 0) {
  //   safeBoxResponse = true;
  //   const safeBoxInfo: ISafeBox[] = await Promise.all(
  //     listToUpdate.map(async (safebox) => {
  //       const APIGetSafeBox = await apiSafeBox.getSafeBox({
  //         authorization: `${tokenType} ${accessToken}`,
  //         safeBoxId: safebox._id,
  //         organizationId: arg.data.organizationId,
  //       });

  //       return APIGetSafeBox?.data?.msg[0];
  //     })
  //   );

  //   await Promise.all(
  //     safeBoxInfo.map(async (safebox: ISafeBox) => {
  //       return DBSafeBox.updateSafeBox({
  //         newSafeBox: {
  //           ...safebox,
  //           anexos: JSON.stringify(safebox.anexos),
  //           data_hora_create: safebox.data_hora_create.$date,
  //           data_atualizacao: safebox.data_atualizacao.$date,
  //           usuarios_escrita_deletado: JSON.stringify(
  //             safebox.usuarios_escrita_deletado
  //           ),
  //           usuarios_leitura_deletado: JSON.stringify(
  //             safebox.usuarios_leitura_deletado
  //           ),
  //           usuarios_escrita: JSON.stringify(safebox.usuarios_escrita),
  //           usuarios_leitura: JSON.stringify(safebox.usuarios_leitura),
  //           id: safebox._id.$oid,
  //         },
  //       });
  //     })
  //   );
  // }

  // if (listToCreate.length > 0) {
  //   safeBoxResponse = true;
  //   const safeBoxInfo: ISafeBox[] = await Promise.all(
  //     listToCreate.map(async (safebox: ISafeBox) => {
  //       const APIGetSafeBox = await apiSafeBox.getSafeBox({
  //         authorization: `${tokenType} ${accessToken}`,
  //         safeBoxId: safebox._id.$oid,
  //         organizationId: arg.data.organizationId,
  //       });

  //       return APIGetSafeBox?.data?.msg[0];
  //     })
  //   );

  //   await Promise.all(
  //     safeBoxInfo.map(async (safebox: ISafeBox) => {
  //       return DBSafeBox.createSafeBox({
  //         safeBox: {
  //           ...safebox,
  //           anexos: JSON.stringify(safebox.anexos),
  //           data_hora_create: safebox.data_hora_create.$date,
  //           data_atualizacao: safebox.data_atualizacao.$date,
  //           usuarios_escrita_deletado: JSON.stringify(
  //             safebox.usuarios_escrita_deletado
  //           ),
  //           usuarios_leitura_deletado: JSON.stringify(
  //             safebox.usuarios_leitura_deletado
  //           ),
  //           usuarios_escrita: JSON.stringify(safebox.usuarios_escrita),
  //           usuarios_leitura: JSON.stringify(safebox.usuarios_leitura),
  //           id: safebox._id.$oid,
  //         },
  //       });
  //     })
  //   );
  // }

  // if (
  //   listAPISafeBox.status === 401 &&
  //   listAPISafeBox.data?.msg === 'Unauthorized'
  // ) {
  //   store.clear();
  //   store.set('initialData', {});
  //   return {
  //     response: 'leave-response',
  //     data: {
  //       type: 'sessionExpired',
  //     },
  //   };
  // }

  // const dbListSafeBox = await DBSafeBox.listSafeBox({
  //   organizationId: arg.data.organizationId,
  // });
  // store.set('safebox', dbListSafeBox);

  return {
    response: IPCTypes.REFRESH_SAFEBOXES_RESPONSE,
    data: {
      // safeBoxResponse,
    },
  };
}
