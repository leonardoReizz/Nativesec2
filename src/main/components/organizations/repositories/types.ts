export interface InviteParticipantData {
  organizationId: string;
  email: string;
  authorization: string;
}

export interface InviteAdminData {
  organizationId: string;
  email: string;
  authorization: string;
}

export interface IUpdateData {
  id: string;
  nome: string;
  tema: string;
  descricao: string;
  icone: string;
}

export interface ICreateOrganizationIconData {
  organizationId: string;
  icon: string;
}

export interface IUpdateOrganizationIcon {
  organizationId: string;
  icon: string;
}

export interface IRemoveParticipantData {
  organizationId: string;
  email: string;
  authorization: string;
}

export interface IRemoveAdminData {
  organizationId: string;
  email: string;
  authorization: string;
}

export interface IRemoveInviteAdminData {
  organizationId: string;
  email: string;
  authorization: string;
}

export interface IRemoveInviteParticipantData {
  organizationId: string;
  email: string;
  authorization: string;
}

export interface IUpdateIconData {
  icon: string;
  organizationId: string;
}

export interface IAcceptInviteData {
  organizationId: string;
  authorization: string;
}

export interface IDeclineInviteData {
  organizationId: string;
  authorization: string;
}

export interface ILeaveData {
  organizationId: string;
  authorization: string;
}
