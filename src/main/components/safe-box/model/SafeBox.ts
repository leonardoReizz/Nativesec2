export interface SafeBoxDatabaseModel {
  _id: string;
  usuarios_leitura: string;
  usuarios_escrita: string;
  usuarios_leitura_deletado: string;
  usuarios_escrita_deletado: string;
  data_hora_create: string;
  data_atualizacao: string;
  tipo: string;
  criptografia: string;
  nome: string;
  anexos: string;
  descricao: string;
  conteudo: string;
  organizacao: string;
}

export interface SafeBoxAPIModel {
  id: string;
  usuarios_leitura: string[];
  usuarios_escrita: string[];
  tipo: string;
  usuarios_leitura_deletado: string[];
  usuarios_escrita_deletado: string[];
  criptografia: string;
  nome: string;
  anexos: string[];
  descricao: string;
  conteudo: string;
  organizacao: string;
}
