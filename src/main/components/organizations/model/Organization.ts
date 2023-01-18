export interface OrganizationModelDatabase {
  _id: string;
  data_criacao: number;
  nome: string;
  tema: string;
  descricao: string;
  dono: string;
  data_atualizacao: number;
  convidados_participantes: string;
  convidados_administradores: string;
  limite_usuarios: number;
  limite_armazenamento: number;
  participantes: string;
  administradores: string;
  deletado: string;
}

export interface OrganizationModelAPI {}
