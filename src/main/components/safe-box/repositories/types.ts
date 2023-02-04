export interface DeleteSafeBoxAPI {
  safeBoxId: string;
  organizationId: string;
}

export interface IUpdateSafeBoxData {
  id: string;
  usuarios_leitura: string[];
  usuarios_escrita: string[];
  usuarios_leitura_deletado: string[];
  usuarios_escrita_deletado: string[];
  tipo: string;
  criptografia: string;
  nome: string;
  anexos: string[];
  descricao: string;
  conteudo: string;
  organizacao: string;
}
