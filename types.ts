
export interface User {
  id: number;
  nome: string;
  login: string;
  email: string;
  situacao: 1 | 0; // 1 = ativo, 0 = inativo
  matricula?: string;
  data_cadastro: string;
}

export enum AssetStatus {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
  Baixado = 'Baixado',
}

export interface Asset {
  cod: number;
  codigo_bem: string;
  descricao: string;
  data_aquisicao: string;
  forma_aquisicao?: string;
  fornecedor?: string;
  local_fisico: number; // FK to Location.cod_local
  situacao: AssetStatus;
  inventariado: 0 | 1; // 0 = não, 1 = sim
  observacoes?: string;
}

export interface Location {
  cod_local: number;
  descricao: string;
  ativo: 0 | 1; // 0 = inativo, 1 = ativo
}
