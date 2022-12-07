import { IOrganizationInvite } from 'renderer/hooks/useIPCOrganizations/types';
import DBOrganization from '../../database/organizations';
import DBOrganizationIcon from '../../database/organizationIcons';
import APIOrganization from '../../API/organizations';

import { IMyOrganization, IOrganization } from '../../../renderer/routes/types';
import { iconsComparator, organizationComparator } from './comparators';

import { IKeys, IToken } from '../../types';
import { store } from '../../main';

import * as types from './types';
import { UseIPCData } from '..';
import { IPCTypes } from '../../../renderer/@types/IPCTypes';

export async function refreshAllOrganizations(arg: UseIPCData) {
  let iconeAllResponse;
  let organizationsResponse;
  const { tokenType, accessToken } = store.get('token') as IToken;

  const APIListMyOrgs = await APIOrganization.listMyOrganizations({
    authorization: `${tokenType} ${accessToken}`,
  });

  const resultOrgs = APIListMyOrgs?.data?.msg as IMyOrganization[];
  if (resultOrgs.length > 0) {
    const organizationInfo: IOrganization[] = await Promise.all(
      resultOrgs.map(async (org: IMyOrganization) => {
        const APIGetOrganization = await APIOrganization.getOrganization({
          authorization: `${tokenType} ${accessToken}`,
          organizationId: org._id.$oid,
        });

        return APIGetOrganization?.data?.msg[0];
      })
    );
    // Comparator
    if (organizationInfo.length > 0) {
      const keys = store.get('keys') as IKeys;
      if (keys.publicKey !== undefined) {
        organizationsResponse = await organizationComparator(organizationInfo);
      }
    }

    const DBListOrganization = await DBOrganization.listOrganizations();

    store.set('organizations', DBListOrganization);

    const APIListOrganizationIcons =
      await APIOrganization.listOrganizationIcons({
        authorization: `${tokenType} ${accessToken}`,
      });
    // Comparator
    if (APIListOrganizationIcons?.data?.msg.length > 0) {
      const keys = store.get('keys') as IKeys;
      if (keys.publicKey !== undefined) {
        iconeAllResponse = await iconsComparator(
          APIListOrganizationIcons?.data?.msg
        );
      }
    }
    const DBListOrganizationIcons =
      await DBOrganizationIcon.listOrganizationsIcons(DBListOrganization);
    store.set('iconeAll', DBListOrganizationIcons);
  }

  if (arg.data?.type === 'refresh') {
    return {
      response: IPCTypes.REFRESH_ALL_ORGANIZATIONS_REFRESH_RESPONSE,
      data: {
        data: {
          organizationsResponse,
          iconeAllResponse,
        },
      },
    };
  }
  return {
    response: IPCTypes.REFRESH_ALL_ORGANIZATIONS_RESPONSE,
    data: {},
  };
}

export async function getMyInvites() {
  const { accessToken, tokenType } = store.get('token') as IToken;
  const APIGetMyInvites = await APIOrganization.getMyInvites({
    authorization: `${tokenType} ${accessToken}`,
  });
  if (APIGetMyInvites.data?.status === 'ok' && APIGetMyInvites.status === 200) {
    store.set('organizationsInvites', APIGetMyInvites?.data?.msg);
  }
  return {
    response: IPCTypes.GET_MY_INVITES_RESPONSE,
    data: {
      status: APIGetMyInvites.status,
      data: APIGetMyInvites.data,
    },
  };
}

export async function createOrganization(arg: UseIPCData) {
  const { accessToken, tokenType } = store.get('token') as IToken;

  const APICreateOrganization = await APIOrganization.createOrganization({
    data: arg.data,
    authorization: `${tokenType} ${accessToken}`,
  });

  if (
    APICreateOrganization.status === 200 &&
    APICreateOrganization?.data?.status === 'ok' &&
    APICreateOrganization.data.detail
  ) {
    const createDBOrg = await DBOrganization.createOrganization({
      data: {
        _id: APICreateOrganization.data.detail[0]._id.$oid,
        name: APICreateOrganization.data.detail[0].nome,
        description: APICreateOrganization.data.detail[0].descricao,
        theme: APICreateOrganization.data.detail[0].tema,
        ownerEmail: APICreateOrganization.data.detail[0].dono,
        updateDate: APICreateOrganization.data.detail[0].data_atualizacao.$date,
        creationDate: APICreateOrganization.data.detail[0].data_criacao.$date,
        limitUsers: APICreateOrganization.data.detail[0].limite_usuarios,
        storageLimit: APICreateOrganization.data.detail[0].limite_armazenamento,
        adminGuests: JSON.stringify(
          APICreateOrganization.data.detail[0].convidados_administradores
        ),
        participantGuests: JSON.stringify(
          APICreateOrganization.data.detail[0].convidados_participantes
        ),
        participants: JSON.stringify(
          APICreateOrganization.data.detail[0].participantes
        ),
        admins: JSON.stringify(
          APICreateOrganization.data.detail[0].administradores
        ),
        deleted: APICreateOrganization.data.detail[0].deletado,
      },
    });

    const createDBIcon = await DBOrganizationIcon.createOrganizationIcon({
      _id: APICreateOrganization.data.detail[0]._id.$oid,
      icon: arg.data.icon,
    });

    if (createDBOrg !== true || createDBIcon !== true) {
      return {
        response: IPCTypes.CREATE_ORGANIZATION_RESPONSE,
        data: {
          status: 500,
          data: {
            msg: 'error database',
          },
        },
      };
    }
  }

  const listOrgs = await DBOrganization.listOrganizations();
  store.set('organizations', listOrgs);

  const listOrgsIcons = await DBOrganizationIcon.listOrganizationsIcons(
    listOrgs
  );
  store.set('iconeAll', listOrgsIcons);
  return {
    response: IPCTypes.CREATE_ORGANIZATION_RESPONSE,
    data: {
      status: APICreateOrganization.status,
      data: APICreateOrganization.data,
    },
  };
}

const organizations = [
  {
    async inviteParticipant(
      event: Electron.IpcMainEvent,
      arg: types.IInviteParticipant
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;
      const type = !arg.user.isAdmin ? 'participant' : 'admin';
      const APIInviteParticipant = await APIOrganization.inviteParticipant({
        type,
        organizationId: arg.organizationId,
        email: arg.user.email,
        authorization: `${tokenType} ${accessToken}`,
      });

      if (
        APIInviteParticipant.status === 200 &&
        APIInviteParticipant.data.status === 'ok'
      ) {
        const orgs = store.get(
          'organizations'
        ) as types.IOrganizationDatabase[];
        const index = orgs.findIndex((item) => item._id === arg.organizationId);

        if (arg.user.isAdmin) {
          const array: string[] = JSON.parse(
            orgs[index].convidados_administradores
          );
          array.push(arg.user.email);
          const invite = await DBOrganization.inviteAdmin({
            adminsGuests: JSON.stringify(array),
            organizationId: arg.organizationId,
          });

          if (invite !== true) {
            return event.reply('createSafeBox-response', {
              status: 500,
              data: 'error database',
            });
          }
        } else {
          const array: string[] = JSON.parse(
            orgs[index].convidados_participantes
          );
          array.push(arg.user.email);
          const invite = await DBOrganization.inviteParticipant({
            participantGuests: JSON.stringify(array),
            organizationId: arg.organizationId,
          });

          if (invite !== true) {
            return event.reply('inviteParticipant-response', {
              status: 500,
              data: 'error database',
            });
          }
        }
      }

      const listOrgs = await DBOrganization.listOrganizations();
      store.set('organizations', listOrgs);

      const listOrgsIcons = await DBOrganizationIcon.listOrganizationsIcons(
        listOrgs
      );
      store.set('iconeAll', listOrgsIcons);

      return event.reply('inviteParticipant-response', {
        ...APIInviteParticipant,
        organizationId: arg.organizationId,
      });
    },
  },
  {
    async deleteInviteParticipant(
      event: Electron.IpcMainEvent,
      arg: types.IDeleteInviteParticipant
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;
      const url =
        arg.user.type === 'admin'
          ? '/organizacao/invitation/admin/'
          : '/organizacao/invitation/participant/';

      const APIDeleteInvite = await APIOrganization.deleteInvite({
        url,
        authorization: `${tokenType} ${accessToken}`,
        organizationId: arg.organizationId,
        userEmail: arg.user.email,
      });

      if (
        APIDeleteInvite.status === 200 &&
        APIDeleteInvite.data?.status === 'ok'
      ) {
        const orgs = store.get(
          'organizations'
        ) as types.IOrganizationDatabase[];
        const index = orgs.findIndex((item) => item._id === arg.organizationId);

        if (arg.user.type === 'admin') {
          const array: string[] = JSON.parse(
            orgs[index].convidados_administradores
          );
          const filter = array.filter((item) => item !== arg.user.email);
          const deleteInvite = await DBOrganization.deleteInviteAdmin({
            adminGuests: JSON.stringify(filter),
            organizationId: arg.organizationId,
          });

          if (deleteInvite !== true) {
            return event.reply('createSafeBox-response', {
              status: 500,
              data: 'error database',
            });
          }
        } else {
          const array: string[] = JSON.parse(
            orgs[index].convidados_participantes
          );
          const filter = array.filter((item) => item !== arg.user.email);
          const deleteInvite = await DBOrganization.deleteInviteParticipant({
            participantGuests: JSON.stringify(filter),
            organizationId: arg.organizationId,
          });

          if (deleteInvite !== true) {
            return event.reply('deleteInviteParticipant-response', {
              status: 500,
              data: 'error database',
            });
          }
        }
      }

      const listOrgs = await DBOrganization.listOrganizations();
      store.set('organizations', listOrgs);

      const listOrgsIcons = await DBOrganizationIcon.listOrganizationsIcons(
        listOrgs
      );
      store.set('iconeAll', listOrgsIcons);

      return event.reply('deleteInviteParticipant-response', {
        ...APIDeleteInvite,
        organizationId: arg.organizationId,
      });
    },
  },
  {
    async removeUser(
      event: Electron.IpcMainEvent,
      arg: types.IDeleteInviteParticipant
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;

      const APIDeleteParticipant = await APIOrganization.deleteParticipant({
        type: arg.user.type,
        userEmail: arg.user.email,
        authorization: `${tokenType} ${accessToken}`,
        organizationId: arg.organizationId,
      });

      if (
        APIDeleteParticipant.status === 200 &&
        APIDeleteParticipant.data?.status === 'ok'
      ) {
        const orgs = store.get(
          'organizations'
        ) as types.IOrganizationDatabase[];
        const index = orgs.findIndex((item) => item._id === arg.organizationId);

        if (arg.user.type === 'admin') {
          const array: string[] = JSON.parse(orgs[index].administradores);
          const filter = array.filter((item) => item !== arg.user.email);
          const deleteInvite = await DBOrganization.deleteAdmin({
            admins: JSON.stringify(filter),
            organizationId: arg.organizationId,
          });

          if (deleteInvite !== true) {
            return event.reply('createSafeBox-response', {
              status: 500,
              data: 'error database',
            });
          }
        } else {
          const array: string[] = JSON.parse(orgs[index].participantes);
          const filter = array.filter((item) => item !== arg.user.email);
          const deleteInvite = await DBOrganization.deleteParticipant({
            participants: JSON.stringify(filter),
            organizationId: arg.organizationId,
          });

          if (deleteInvite !== true) {
            return event.reply('removeUser-response', {
              status: 500,
              data: 'error database',
            });
          }
        }
      }

      const listOrgs = await DBOrganization.listOrganizations();
      store.set('organizations', listOrgs);

      const listOrgsIcons = await DBOrganizationIcon.listOrganizationsIcons(
        listOrgs
      );
      store.set('iconeAll', listOrgsIcons);

      return event.reply('removeUser-response', {
        ...APIDeleteParticipant,
        organizationId: arg.organizationId,
      });
    },
  },
  {
    async changeOrganization(
      event: Electron.IpcMainEvent,
      arg: types.IChangeOrganization
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;
      const APIUpdateOrganization = await APIOrganization.updateOrganization({
        data: arg,
        authorization: `${tokenType} ${accessToken}`,
      });

      if (
        APIUpdateOrganization.status === 200 &&
        APIUpdateOrganization.data?.status === 'ok'
      ) {
        const DBOrganizationUpdate = await DBOrganization.updateOrganization({
          data: {
            ...arg,
          },
        });
        const DBOrganizationIconUpdate =
          await DBOrganizationIcon.updateOrganizationIcon({
            icon: arg.icon,
            organizationId: arg.organizationId,
          });

        if (
          DBOrganizationUpdate !== true ||
          DBOrganizationIconUpdate !== true
        ) {
          return event.reply('changeOrganization-response', {
            status: 500,
            data: 'error database',
          });
        }
      }

      const listOrgs = await DBOrganization.listOrganizations();
      store.set('organizations', listOrgs);

      const listOrgsIcons = await DBOrganizationIcon.listOrganizationsIcons(
        listOrgs
      );
      store.set('iconeAll', listOrgsIcons);

      return event.reply('changeOrganization-response', {
        ...APIUpdateOrganization,
        organizationId: arg.organizationId,
      });
    },
  },
  {
    async deleteOrganization(
      event: Electron.IpcMainEvent,
      arg: types.IDeleteOrganization
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;
      const APIDeleteOrganization = await APIOrganization.deleteOrganization({
        organizationId: arg.organizationId,
        authorization: `${tokenType} ${accessToken}`,
      });

      if (
        APIDeleteOrganization.status === 200 &&
        APIDeleteOrganization?.data?.status === 'ok'
      ) {
        const DBDeleteOrganization = await DBOrganization.deleteOrganization({
          organizationId: arg.organizationId,
        });

        const DBDeleteOrganizationIcon =
          await DBOrganizationIcon.deleteOrganizationIcon({
            organizationId: arg.organizationId,
          });

        if (
          DBDeleteOrganization !== true ||
          DBDeleteOrganizationIcon !== true
        ) {
          return event.reply('deleteOrganization-response', {
            status: 500,
            data: 'error database',
          });
        }
      }

      const listOrgs = await DBOrganization.listOrganizations();
      store.set('organizations', listOrgs);

      const listOrgsIcons = await DBOrganizationIcon.listOrganizationsIcons(
        listOrgs
      );
      store.set('iconeAll', listOrgsIcons);

      return event.reply('deleteOrganization-response', APIDeleteOrganization);
    },
  },
  {
    async leaveOrganization(
      event: Electron.IpcMainEvent,
      arg: types.ILeaveOrganization
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;

      const APIOrganizationLeave = await APIOrganization.leaveOrganization({
        authorization: `${tokenType} ${accessToken}`,
        organizationId: arg.organizationId,
      });

      if (
        APIOrganizationLeave.status === 200 &&
        APIOrganizationLeave?.data?.status === 'ok'
      ) {
        const DBOrganizationLeave = await DBOrganization.deleteOrganization({
          organizationId: arg.organizationId,
        });

        const DBLeaveOrganizationIcon =
          await DBOrganizationIcon.deleteOrganizationIcon({
            organizationId: arg.organizationId,
          });

        if (DBOrganizationLeave !== true || DBLeaveOrganizationIcon !== true) {
          return event.reply('deleteOrganization-response', {
            status: 500,
            data: 'error database',
          });
        }
      }

      const listOrgs = await DBOrganization.listOrganizations();
      store.set('organizations', listOrgs);

      const listOrgsIcons = await DBOrganizationIcon.listOrganizationsIcons(
        listOrgs
      );
      store.set('iconeAll', listOrgsIcons);

      return event.reply('leaveOrganization-response', APIOrganizationLeave);
    },
  },
  {
    async acceptInvite(event: Electron.IpcMainEvent, arg: types.IAcceptInvite) {
      const { accessToken, tokenType } = store.get('token') as IToken;
      const APIAcceptInvite = await APIOrganization.acceptInvite({
        authorization: `${tokenType} ${accessToken}`,
        organizationId: arg.organizationId,
      });

      if (
        APIAcceptInvite.status === 200 &&
        APIAcceptInvite.data?.status === 'ok'
      ) {
        const APIGetOrgananization = await APIOrganization.getOrganization({
          authorization: `${tokenType} ${accessToken}`,
          organizationId: arg.organizationId,
        });
        const APIGetOrganizationIcon =
          await APIOrganization.getOrganizationIcon({
            authorization: `${tokenType} ${accessToken}`,
            organizationId: arg.organizationId,
          });
        if (
          APIGetOrgananization.status === 200 &&
          APIGetOrganizationIcon.status === 200 &&
          APIGetOrgananization.data?.status === 'ok' &&
          APIGetOrganizationIcon.data?.status === 'ok'
        ) {
          const DBCreateOrganization = await DBOrganization.createOrganization({
            data: {
              _id: APIGetOrgananization.data.msg[0]._id.$oid,
              deleted: APIGetOrgananization.data.msg[0].deletado,
              creationDate: APIGetOrgananization.data.msg[0].data_criacao.$date,
              limitUsers: APIGetOrgananization.data.msg[0].limite_usuarios,
              name: APIGetOrgananization.data.msg[0].nome,
              adminGuests: JSON.stringify(
                APIGetOrgananization.data.msg[0].convidados_administradores
              ),
              admins: JSON.stringify(
                APIGetOrgananization.data.msg[0].administradores
              ),
              participantGuests: JSON.stringify(
                APIGetOrgananization.data.msg[0].convidados_participantes
              ),
              participants: JSON.stringify(
                APIGetOrgananization.data.msg[0].participantes
              ),
              ownerEmail: APIGetOrgananization.data.msg[0].dono,
              storageLimit:
                APIGetOrgananization.data.msg[0].limite_armazenamento,
              description: APIGetOrgananization.data.msg[0].descricao,
              theme: APIGetOrgananization.data.msg[0].tema,
              updateDate:
                APIGetOrgananization.data.msg[0].data_atualizacao.$date,
            },
          });

          const DBCreateOrganizationIcon =
            await DBOrganizationIcon.createOrganizationIcon({
              _id: APIGetOrgananization.data.msg[0]._id.$oid,
              icon: APIGetOrganizationIcon.data.msg[0].icone,
            });

          if (
            DBCreateOrganizationIcon !== true ||
            DBCreateOrganization !== true
          ) {
            return event.reply('acceptInvite-response', {
              status: 500,
              data: 'error database',
            });
          }
        }
      }

      const invites = store.get(
        'organizationsInvites'
      ) as IOrganizationInvite[];

      const filter = invites.filter(
        (invite) => invite._id.$oid !== arg.organizationId
      );

      store.set('organizationsInvites', filter);

      const listOrgs = await DBOrganization.listOrganizations();
      store.set('organizations', listOrgs);

      const listOrgsIcons = await DBOrganizationIcon.listOrganizationsIcons(
        listOrgs
      );
      store.set('iconeAll', listOrgsIcons);

      return event.reply('acceptInvite-response', {
        ...APIAcceptInvite,
        organizationId: arg.organizationId,
      });
    },
  },
  {
    async declineInvite(
      event: Electron.IpcMainEvent,
      arg: types.IDeclineInvite
    ) {
      const { accessToken, tokenType } = store.get('token') as IToken;
      const APIDeclineInvite = await APIOrganization.declineInvite({
        authorization: `${tokenType} ${accessToken}`,
        organizationId: arg.organizationId,
      });

      const organizationsInvites = store.get(
        'organizationsInvites'
      ) as IOrganizationInvite[];

      const filterOrganizationsInvites = organizationsInvites.filter(
        (invite) => invite._id.$oid !== arg.organizationId
      );

      store.set('organizationsInvites', filterOrganizationsInvites);

      return event.reply('declineInvite-response', {
        ...APIDeclineInvite,
        organizationId: arg.organizationId,
      });
    },
  },
];

export default organizations;
