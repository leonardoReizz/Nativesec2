import { update } from 'main/database/migrations/versions/1.1.3';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IPCTypes } from 'renderer/@types/IPCTypes';
import { IIPCResponse } from 'renderer/@types/types';
import { toastOptions } from 'renderer/utils/options/Toastify';
import { useLoading } from '../useLoading';
import { useOrganization } from '../useOrganization/useOrganization';
import * as types from './types';

export function useIpcOrganization() {
  const {
    refreshOrganizations,
    changeCurrentOrganization,
    currentOrganization,
  } = useOrganization();
  const { updateLoading } = useLoading();
  const navigate = useNavigate();
  //   const { changeModal } = useContext(ModalContext);
  //   const {
  //     updateOrganizations,
  //     updateOrganizationsIcons,
  //     changeCurrentOrganization,
  //     refreshOrganizations,
  //     updateOrganizationsInvites,
  //   } = useContext(OrganizationsContext);

  //   useEffect(() => {
  //     window.electron.ipcRenderer.on('deleteOrganization-response', (result) => {
  //       const myResult = result as IIPCResponse;
  //       switch (myResult.status) {
  //         case 200:
  //           if (myResult.data?.status === 'ok') {
  //             refreshOrganizations();
  //             navigate('/createWorkspace');
  //             toast.success('Workspace deletado.', {
  //               ...toastOptions,
  //               toastId: 'successDeleteOrganization',
  //             });
  //             changeModal(true);
  //           } else {
  //             toast.error('Erro ao deletar workspace.', {
  //               ...toastOptions,
  //               toastId: 'errorDeleteOrganization',
  //             });
  //           }
  //           break;
  //         default:
  //           toast.error('Erro ao deletar workspace.', {
  //             ...toastOptions,
  //             toastId: 'errorDeleteOrganization',
  //           });
  //           break;
  //       }
  //     });
  //   }, [navigate]);

  //   useEffect(() => {
  //     window.electron.ipcRenderer.on(
  //       IPCTypes.REFRESH_ALL_ORGANIZATIONS_REFRESH_RESPONSE,
  //       (result: IDefaultApiResult) => {
  //         if (result.data?.iconeAllResponse) {
  //           updateOrganizationsIcons(window.electron.store.get('iconeAll'));
  //         }
  //         if (result.data?.organizationsResponse) {
  //           console.log(window.electron.store.get('organizations'));
  //           updateOrganizations(window.electron.store.get('organizations'));
  //         }
  //       }
  //     );
  //   }, []);

  //   useEffect(() => {
  //     window.electron.ipcRenderer.on(
  //       'changeOrganization-response',
  //       (result: types.IChangeOrganizationResponse) => {
  //         switch (result.status) {
  //           case 200:
  //             refreshOrganizations();
  //             changeCurrentOrganization(result.organizationId);
  //             toast.success('Organização Alterada.', {
  //               ...toastOptions,
  //               toastId: 'changeOrganizationSucess',
  //             });
  //             break;
  //           default:
  //             toast.error('Erro ao alterar organizacão.', {
  //               ...toastOptions,
  //               toastId: 'erroChangeOrganization',
  //             });
  //             break;
  //         }
  //       }
  //     );
  //   }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.CREATE_ORGANIZATION_RESPONSE,
      async (result: types.CreateOrganizationResponse) => {
        console.log(result);
        if (result.message === 'ok') {
          refreshOrganizations();
          navigate(`/workspace/${result.organization._id}`);
          changeCurrentOrganization(result.organization._id);
          updateLoading(false);
          toast.success('Organizacão Criado com Sucesso', {
            ...toastOptions,
            toastId: 'workspace-created',
          });
        } else {
          updateLoading(false);
          toast.error('Erro ao criar Workspace', {
            ...toastOptions,
            toastId: 'workspace-error',
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.DELETE_ORGANIZATION_RESPONSE,
      async (result: types.CreateOrganizationResponse) => {
        if (result.message === 'ok') {
          refreshOrganizations();
          navigate('/createOrganization');
          changeCurrentOrganization(undefined);
          updateLoading(false);
          toast.success('Organizacão Criado com Sucesso', {
            ...toastOptions,
            toastId: 'workspace-created',
          });
        } else {
          updateLoading(false);
          toast.error('Erro ao deletar Workspace', {
            ...toastOptions,
            toastId: 'workspace-error',
          });
        }
      }
    );
  }, []);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCTypes.UPDATE_ORGANIZATION_RESPONSE,
      async (result: types.CreateOrganizationResponse) => {
        if (result.message === 'ok') {
          refreshOrganizations();
          changeCurrentOrganization(currentOrganization?._id);
          toast.success('Organizacão atualizada com sucesso.', {
            ...toastOptions,
            toastId: 'updated-organization',
          });
        } else {
          toast.error('Erro ao atualizar organização.', {
            ...toastOptions,
            toastId: 'organization-error',
          });
        }
      }
    );
  }, [currentOrganization]);

  //   useEffect(() => {
  //     window.electron.ipcRenderer.on(
  //       'deleteInviteParticipant-response',
  //       (result) => {
  //         const myResult = result as types.IDeleteInviteParticipantResponse;
  //         switch (myResult.status) {
  //           case 200:
  //             if (myResult.data.status === 'ok') {
  //               refreshOrganizations();
  //               changeCurrentOrganization(result.organizationId);
  //               changeModal(true);
  //               toast.success('Convite deletado.', {
  //                 ...toastOptions,
  //                 toastId: 'deleteInviteSucess',
  //               });
  //             } else {
  //               toast.error('Erro ao deletar convite.', {
  //                 ...toastOptions,
  //                 toastId: 'erroDeleteInvite',
  //               });
  //             }
  //             break;
  //           default:
  //             toast.error('Erro ao deletar convite.', {
  //               ...toastOptions,
  //               toastId: 'erroDeleteInvite',
  //             });
  //             break;
  //         }
  //       }
  //     );
  //   }, []);

  //   useEffect(() => {
  //     window.electron.ipcRenderer.on(
  //       'inviteParticipant-response',
  //       (result: types.IInviteParticipantResponse) => {
  //         switch (result.status) {
  //           case 200:
  //             if (result.data?.status === 'ok') {
  //               refreshOrganizations();
  //               changeCurrentOrganization(result.organizationId);
  //               changeModal(true);
  //               toast.success('Convite enviado.', {
  //                 ...toastOptions,
  //                 toastId: 'invitedSuccess',
  //               });
  //             } else {
  //               toast.error('Erro ao enviar convite.', {
  //                 ...toastOptions,
  //                 toastId: 'erroCreateInvite',
  //               });
  //             }
  //             break;
  //           default:
  //             toast.error('Erro ao enviar convite.', {
  //               ...toastOptions,
  //               toastId: 'erroCreateInvite',
  //             });
  //             break;
  //         }
  //       }
  //     );
  //   }, []);

  //   useEffect(() => {
  //     window.electron.ipcRenderer.on('leaveOrganization-response', (result) => {
  //       const myResult = result as IDefaultApiResult;

  //       switch (myResult.status) {
  //         case 200:
  //           if (myResult.data?.status === 'ok') {
  //             // closeModal();
  //             navigate('/createWorkspace');
  //             refreshOrganizations();
  //             toast.success('Você saiu do workspace', {
  //               ...toastOptions,
  //               toastId: 'successLeaveWorkapce',
  //             });
  //           }
  //           break;
  //         default:
  //           toast.error('Erro ao sair do workspace', {
  //             ...toastOptions,
  //             toastId: 'errorLeaveWorkspace',
  //           });
  //           break;
  //       }
  //     });
  //   }, []);

  //   useEffect(() => {
  //     window.electron.ipcRenderer.on(
  //       'acceptInvite-response',
  //       (result: types.IAcceptInviteResponse) => {
  //         switch (result.status) {
  //           case 200:
  //             if (result.data?.status === 'ok') {
  //               updateOrganizationsInvites(
  //                 window.electron.store.get('organizationsInvites')
  //               );
  //               refreshOrganizations();
  //               // closeModal();
  //               toast.success('Convite aceito.', {
  //                 ...toastOptions,
  //                 toastId: 'acceptInvite',
  //               });
  //             } else {
  //               toast.error('Erro ao aceitar convite.', {
  //                 ...toastOptions,
  //                 toastId: 'errorAcceptInvite',
  //               });
  //             }
  //             break;
  //           default:
  //             toast.error('Erro ao aceitar convite.', {
  //               ...toastOptions,
  //               toastId: 'errorAcceptInvite',
  //             });
  //             break;
  //         }
  //       }
  //     );
  //   }, []);

  //   useEffect(() => {
  //     window.electron.ipcRenderer.on(
  //       'declineInvite-response',
  //       (result: types.IDeclineInviteResponse) => {
  //         const myResult = result as IDefaultApiResult;
  //         switch (myResult.status) {
  //           case 200:
  //             if (myResult.data?.status === 'ok') {
  //               updateOrganizationsInvites(
  //                 window.electron.store.get('organizationsInvites')
  //               );
  //               toast.success('Convite rejeitado.', {
  //                 ...toastOptions,
  //                 toastId: 'declineInvite',
  //               });
  //             }
  //             break;
  //           default:
  //             toast.error('Erro ao recusar convite', {
  //               ...toastOptions,
  //               toastId: 'errorDeclineInvite.',
  //             });
  //             break;
  //         }
  //       }
  //     );
  //   }, []);

  //   useEffect(() => {
  //     window.electron.ipcRenderer.on(
  //       IPCTypes.GET_MY_INVITES,
  //       (result: IDefaultApiResult) => {
  //         switch (result.status) {
  //           case 200:
  //             if (result.data?.status === 'ok' && result.data.msg.length > 0) {
  //               updateOrganizationsInvites(
  //                 window.electron.store.get('organizationsInvites')
  //               );
  //             }
  //             break;
  //           default:
  //             break;
  //         }
  //       }
  //     );
  //   }, []);

  //   useEffect(() => {
  //     window.electron.ipcRenderer.on('removeUser-response', (result) => {
  //       const myResult = result as types.IDeleteInviteParticipantResponse;
  //       switch (myResult.status) {
  //         case 200:
  //           if (myResult.data.status === 'ok') {
  //             refreshOrganizations();
  //             changeCurrentOrganization(result.organizationId);
  //             changeModal(true);
  //             toast.success('Usuario removido.', {
  //               ...toastOptions,
  //               toastId: 'removeUserSuccess',
  //             });
  //           } else {
  //             toast.error('Erro ao remover usuario.', {
  //               ...toastOptions,
  //               toastId: 'errorRemoveUser',
  //             });
  //           }
  //           break;
  //         default:
  //           toast.error('Erro ao remover usuario.', {
  //             ...toastOptions,
  //             toastId: 'errorRemoveUser',
  //           });
  //           break;
  //       }
  //     });
  //   }, []);
}
