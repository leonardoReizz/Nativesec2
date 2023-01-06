export interface IUpdateSafeBoxRequestDTO {
  usuarios_leitura: string[];
  usuarios_escrita: string[];
  tipo: string;
  usuarios_leitura_deletado: string[];
  usuarios_escrita_deletado: string[];
  criptografia: string;
  nome: string;
  anexos: string[];
  descricao: string;
  conteudo: string[];
  organizacao: string;
  id: string;
}
