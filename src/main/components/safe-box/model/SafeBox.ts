export interface SafeBoxDatabaseModel {
  id: string;
  usuarios_leitura: string;
  usuarios_escrita: string;
  usuarios_leitura_deletado: string;
  usuarios_escrita_deletado: string;
  data_hora_create: number;
  data_atualizacao: number;
  tipo: string;
  criptografia: string;
  nome: string;
  anexos: string;
  descricao: string;
  conteudo: string;
  organizacao: string;
}

export interface SafeBoxAPIModel {
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
