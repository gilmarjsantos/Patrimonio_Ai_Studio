
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Asset, Location, AssetStatus } from '../../types';
import * as api from '../../services/api';
import Modal from '../common/Modal';

const AssetForm: React.FC<{
  asset: Partial<Asset> | null;
  onSave: (asset: Asset | Omit<Asset, 'cod'>) => void;
  onCancel: () => void;
  locations: Location[];
}> = ({ asset, onSave, onCancel, locations }) => {
  const [formData, setFormData] = useState<Partial<Asset>>({
    codigo_bem: '',
    descricao: '',
    data_aquisicao: new Date().toISOString().split('T')[0],
    local_fisico: undefined,
    situacao: AssetStatus.Ativo,
    inventariado: 0,
    fornecedor: '',
    forma_aquisicao: '',
    observacoes: '',
    ...asset
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked ? 1 : 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.codigo_bem || !formData.local_fisico || !formData.data_aquisicao) {
        alert('Campos obrigatórios: Descrição, Código do Bem, Local Físico, Data de Aquisição');
        return;
    }
    onSave(formData as Asset);
  };

  const activeLocations = locations.filter(l => l.ativo === 1 || l.cod_local === asset?.local_fisico);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Código do Bem*</label>
          <input type="text" name="codigo_bem" value={formData.codigo_bem} onChange={handleChange} required maxLength={8} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição*</label>
          <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Local Físico*</label>
          <select name="local_fisico" value={formData.local_fisico} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Selecione...</option>
            {activeLocations.map(loc => <option key={loc.cod_local} value={loc.cod_local}>{loc.descricao}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Situação*</label>
          <select name="situacao" value={formData.situacao} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            {Object.values(AssetStatus).map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Aquisição*</label>
          <input type="date" name="data_aquisicao" value={formData.data_aquisicao} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fornecedor</label>
          <input type="text" name="fornecedor" value={formData.fornecedor} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
      </div>
       <div>
          <label className="block text-sm font-medium text-gray-700">Observações</label>
          <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
      <div className="flex items-center">
        <input type="checkbox" name="inventariado" checked={formData.inventariado === 1} onChange={handleChange} className="h-4 w-4 text-secondary border-gray-300 rounded" />
        <label className="ml-2 block text-sm text-gray-900">Inventariado</label>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-700">Salvar</button>
      </div>
    </form>
  );
};


const AssetsPage: React.FC = () => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [editingAsset, setEditingAsset] = useState<Partial<Asset> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filters, setFilters] = useState({ location: '', status: '', inventoried: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    const { code } = useParams<{ code: string }>();

    const fetchAssetsAndLocations = useCallback(async () => {
        try {
            const [assetsData, locationsData] = await Promise.all([api.getAssets(), api.getLocations()]);
            setAssets(assetsData);
            setLocations(locationsData);

            if (code) {
                const assetToEdit = assetsData.find(a => a.codigo_bem === code.padStart(8, '0'));
                if (assetToEdit) {
                    setEditingAsset(assetToEdit);
                    setIsModalOpen(true);
                } else {
                    alert('Bem não encontrado.');
                    navigate('/assets');
                }
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            alert('Falha ao carregar dados.');
        }
    }, [code, navigate]);

    useEffect(() => {
        fetchAssetsAndLocations();
    }, [fetchAssetsAndLocations]);
    
    const handleSaveAsset = async (assetData: Asset | Omit<Asset, 'cod'>) => {
        try {
            if ('cod' in assetData && assetData.cod) {
                await api.updateAsset(assetData as Asset);
            } else {
                await api.addAsset(assetData);
            }
            await fetchAssetsAndLocations();
            closeModal();
        } catch (error) {
            console.error('Failed to save asset:', error);
            alert(`Falha ao salvar bem: ${error}`);
        }
    };

    const handleDeleteAsset = async (cod: number) => {
        if (window.confirm('Tem certeza que deseja excluir este bem?')) {
            try {
                await api.deleteAsset(cod);
                await fetchAssetsAndLocations();
            } catch (error) {
                console.error('Failed to delete asset:', error);
                alert(`Falha ao excluir bem: ${error}`);
            }
        }
    };

    const openModal = (asset: Partial<Asset> | null = null) => {
        setEditingAsset(asset);
        setIsModalOpen(true);
        if(code) navigate('/assets');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAsset(null);
        if(code) navigate('/assets');
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredAssets = useMemo(() => {
        return assets
            .filter(asset => !filters.location || asset.local_fisico === parseInt(filters.location))
            .filter(asset => !filters.status || asset.situacao === filters.status)
            .filter(asset => filters.inventoried === '' || asset.inventariado === parseInt(filters.inventoried))
            .filter(asset => 
                asset.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asset.codigo_bem.includes(searchTerm)
            );
    }, [assets, filters, searchTerm]);

    const getLocationName = (cod_local: number) => locations.find(l => l.cod_local === cod_local)?.descricao || 'N/A';

    return (
        <div className="container mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-2xl font-bold text-gray-700">Gerenciar Bens</h2>
                    <button onClick={() => openModal({})} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800 w-full md:w-auto">
                        Adicionar Novo Bem
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
                    <input
                        type="text"
                        placeholder="Buscar por código ou descrição..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="p-2 border rounded-md"
                    />
                    <select name="location" value={filters.location} onChange={handleFilterChange} className="p-2 border rounded-md">
                        <option value="">Todos os Locais</option>
                        {locations.map(l => <option key={l.cod_local} value={l.cod_local}>{l.descricao}</option>)}
                    </select>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded-md">
                        <option value="">Todas as Situações</option>
                        {Object.values(AssetStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select name="inventoried" value={filters.inventoried} onChange={handleFilterChange} className="p-2 border rounded-md">
                        <option value="">Inventário (Todos)</option>
                        <option value="1">Sim</option>
                        <option value="0">Não</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Cód. Bem</th>
                                <th className="p-3">Descrição</th>
                                <th className="p-3">Local Físico</th>
                                <th className="p-3">Situação</th>
                                <th className="p-3">Inventariado</th>
                                <th className="p-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssets.map(asset => (
                                <tr key={asset.cod} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-mono">{asset.codigo_bem}</td>
                                    <td className="p-3">{asset.descricao}</td>
                                    <td className="p-3">{getLocationName(asset.local_fisico)}</td>
                                    <td className="p-3">{asset.situacao}</td>
                                    <td className="p-3">{asset.inventariado ? 'Sim' : 'Não'}</td>
                                    <td className="p-3 flex space-x-2">
                                        <button onClick={() => openModal(asset)} className="text-blue-600 hover:text-blue-800">Editar</button>
                                        <button onClick={() => handleDeleteAsset(asset.cod)} className="text-red-600 hover:text-red-800">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingAsset?.cod ? 'Editar Bem' : 'Adicionar Novo Bem'}>
                {editingAsset !== null && <AssetForm asset={editingAsset} onSave={handleSaveAsset} onCancel={closeModal} locations={locations} />}
            </Modal>
        </div>
    );
};

export default AssetsPage;
