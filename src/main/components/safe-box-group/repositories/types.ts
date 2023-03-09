export interface IUpdateSafeBoxGroupAPIData {
  id: string;
  nome: string;
  cofres: string[];
  organizacao: string;
  descricao: string;
}

export interface IDeleteSafeBoxGroupAPI {
  organizationId: string;
  safeBoxGroupId: string;
}
