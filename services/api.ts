
import { User, Asset, Location, AssetStatus } from '../types';

// --- MOCK DATA ---

export const MOCK_USERS: User[] = [
  { id: 1, nome: 'Admin User', login: 'admin', email: 'admin@example.com', situacao: 1, data_cadastro: '2023-01-01' },
  { id: 2, nome: 'Inactive User', login: 'inactive', email: 'inactive@example.com', situacao: 0, data_cadastro: '2023-01-02' },
  { id: 3, nome: 'John Doe', login: 'johndoe', email: 'john.doe@example.com', situacao: 1, data_cadastro: '2023-02-10' },
];

let MOCK_LOCATIONS: Location[] = [
  { cod_local: 1, descricao: 'Almoxarifado', ativo: 1 },
  { cod_local: 2, descricao: 'Sala 101', ativo: 1 },
  { cod_local: 3, descricao: 'Depósito', ativo: 1 },
  { cod_local: 4, descricao: 'Escritório Antigo', ativo: 0 },
];

let MOCK_ASSETS: Asset[] = [
  { cod: 1, codigo_bem: '00055789', descricao: 'Notebook Dell Latitude 5420', data_aquisicao: '2023-05-20', local_fisico: 2, situacao: AssetStatus.Ativo, inventariado: 1, fornecedor: 'Dell Inc.' },
  { cod: 2, codigo_bem: '00055790', descricao: 'Cadeira de Escritório Ergonômica', data_aquisicao: '2022-11-15', local_fisico: 2, situacao: AssetStatus.Ativo, inventariado: 1, fornecedor: 'Staples' },
  { cod: 3, codigo_bem: '00055791', descricao: 'Monitor LG Ultrawide 29"', data_aquisicao: '2023-02-10', local_fisico: 1, situacao: AssetStatus.Ativo, inventariado: 0, fornecedor: 'LG Electronics' },
  { cod: 4, codigo_bem: '00055792', descricao: 'Impressora HP LaserJet Pro', data_aquisicao: '2021-08-01', local_fisico: 3, situacao: AssetStatus.Inativo, inventariado: 0, fornecedor: 'HP' },
  { cod: 5, codigo_bem: '00055793', descricao: 'Projetor Epson PowerLite', data_aquisicao: '2020-01-30', local_fisico: 3, situacao: AssetStatus.Baixado, inventariado: 1, fornecedor: 'Epson' },
];

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const padAssetCode = (code: string): string => code.padStart(8, '0');

// --- API FUNCTIONS ---

export const login = async (login: string, pass: string): Promise<User> => {
  await simulateDelay(500);
  const user = MOCK_USERS.find(u => u.login === login && u.situacao === 1);
  if (user && pass === 'password') { // Mock password check
    return user;
  }
  throw new Error('Credenciais inválidas ou usuário inativo.');
};

// ASSETS
export const getAssets = async (): Promise<Asset[]> => {
  await simulateDelay(300);
  return [...MOCK_ASSETS];
};

export const getAssetByCode = async (code: string): Promise<Asset | undefined> => {
  await simulateDelay(200);
  return MOCK_ASSETS.find(a => a.codigo_bem === padAssetCode(code));
};


export const addAsset = async (asset: Omit<Asset, 'cod'>): Promise<Asset> => {
  await simulateDelay(400);
  const newAsset: Asset = {
    ...asset,
    cod: Math.max(0, ...MOCK_ASSETS.map(a => a.cod)) + 1,
    codigo_bem: padAssetCode(asset.codigo_bem),
  };
  MOCK_ASSETS.push(newAsset);
  return newAsset;
};

export const updateAsset = async (updatedAsset: Asset): Promise<Asset> => {
  await simulateDelay(400);
  const index = MOCK_ASSETS.findIndex(a => a.cod === updatedAsset.cod);
  if (index === -1) throw new Error('Bem não encontrado.');
  MOCK_ASSETS[index] = { ...updatedAsset, codigo_bem: padAssetCode(updatedAsset.codigo_bem) };
  return MOCK_ASSETS[index];
};

export const deleteAsset = async (cod: number): Promise<void> => {
  await simulateDelay(500);
  MOCK_ASSETS = MOCK_ASSETS.filter(a => a.cod !== cod);
};

// LOCATIONS
export const getLocations = async (): Promise<Location[]> => {
  await simulateDelay(300);
  return [...MOCK_LOCATIONS];
};

export const addLocation = async (location: Omit<Location, 'cod_local'>): Promise<Location> => {
  await simulateDelay(400);
  const newLocation: Location = {
    ...location,
    cod_local: Math.max(0, ...MOCK_LOCATIONS.map(l => l.cod_local)) + 1,
  };
  MOCK_LOCATIONS.push(newLocation);
  return newLocation;
};

export const updateLocation = async (updatedLocation: Location): Promise<Location> => {
  await simulateDelay(400);
  const index = MOCK_LOCATIONS.findIndex(l => l.cod_local === updatedLocation.cod_local);
  if (index === -1) throw new Error('Local não encontrado.');
  MOCK_LOCATIONS[index] = updatedLocation;
  return MOCK_LOCATIONS[index];
};

export const deleteLocation = async (cod_local: number): Promise<void> => {
  await simulateDelay(500);
  if (MOCK_ASSETS.some(a => a.local_fisico === cod_local)) {
    throw new Error('Não é possível remover locais físicos já utilizados por algum bem cadastrado.');
  }
  MOCK_LOCATIONS = MOCK_LOCATIONS.filter(l => l.cod_local !== cod_local);
};

// USERS
export const getUsers = async (): Promise<User[]> => {
    await simulateDelay(300);
    return [...MOCK_USERS];
};

export const addUser = async (user: Omit<User, 'id' | 'data_cadastro'>): Promise<User> => {
    await simulateDelay(400);
    const newUser: User = {
        ...user,
        id: Math.max(0, ...MOCK_USERS.map(u => u.id)) + 1,
        data_cadastro: new Date().toISOString().split('T')[0],
    };
    MOCK_USERS.push(newUser);
    return newUser;
};

export const updateUser = async (updatedUser: User): Promise<User> => {
    await simulateDelay(400);
    const index = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
    if (index === -1) throw new Error('Usuário não encontrado.');
    MOCK_USERS[index] = updatedUser;
    return MOCK_USERS[index];
};
