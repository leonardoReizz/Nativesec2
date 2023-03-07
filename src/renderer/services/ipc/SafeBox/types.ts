export interface IDeleteSafeBox {
  organizationId: string;
  safeBoxId: string;
}

export interface IUpdateUserSafeBox {
  usuarios_leitura: string[];
  usuarios_escrita: string[];
  tipo: string;
  usuarios_leitura_deletado: string[];
  usuarios_escrita_deletado: string[];
  criptografia: string;
  nome: string;
  anexos: string;
  descricao: string;
  conteudo: string;
  organizacao: string;
  id: string;
}

export interface IAddSafeBoxUsersIPC {
  usuarios_leitura: string[];
  usuarios_escrita: string[];
  tipo: string;
  usuarios_leitura_deletado: string[];
  usuarios_escrita_deletado: string[];
  criptografia: string;
  nome: string;
  anexos: string[];
  descricao: string;
  conteudo: any;
  organizacao: string;
  _id: string;
}
