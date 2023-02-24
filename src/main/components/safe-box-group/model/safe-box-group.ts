export interface ISafeBoxGroupModelAPI {
  _id: {
    $oid: string;
  };
  data_hora_create: {
    $date: number;
  };
  data_atualizacao: {
    $date: number;
  };
  nome: string;
  cofres: string[];
  organizacao: string;
  dono: string;
  descricao: string;
}

export interface ISafeBoxGroupModelDatabase {
  _id: string;
  data_hora_create: number;
  data_atualizacao: number;
  nome: string;
  cofres: string;
  organizacao: string;
  dono: string;
  descricao: string;
}
