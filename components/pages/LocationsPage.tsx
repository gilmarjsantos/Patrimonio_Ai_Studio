
import React, { useState, useEffect, useCallback } from 'react';
import { Location } from '../../types';
import * as api from '../../services/api';
import Modal from '../common/Modal';

const LocationForm: React.FC<{
  location: Partial<Location> | null;
  onSave: (location: Location | Omit<Location, 'cod_local'>) => void;
  onCancel: () => void;
}> = ({ location, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Location>>({
    descricao: '',
    ativo: 1,
    ...location
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (!formData.descricao) {
      alert('O campo Descrição é obrigatório.');
      return;
    }
    onSave(formData as Location);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição*</label>
        <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="ativo" id="ativo" checked={formData.ativo === 1} onChange={handleChange} className="h-4 w-4 text-secondary border-gray-300 rounded" />
        <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">Ativo</label>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-700">Salvar</button>
      </div>
    </form>
  );
};


const LocationsPage: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [editingLocation, setEditingLocation] = useState<Partial<Location> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchLocations = useCallback(async () => {
        try {
            setLocations(await api.getLocations());
        } catch (error) {
            console.error('Failed to fetch locations:', error);
            alert('Falha ao carregar locais.');
        }
    }, []);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);
    
    const handleSaveLocation = async (locationData: Location | Omit<Location, 'cod_local'>) => {
        try {
            if ('cod_local' in locationData && locationData.cod_local) {
                await api.updateLocation(locationData as Location);
            } else {
                await api.addLocation(locationData);
            }
            await fetchLocations();
            closeModal();
        } catch (error) {
            console.error('Failed to save location:', error);
            alert(`Falha ao salvar local: ${error}`);
        }
    };

    const handleDeleteLocation = async (cod_local: number) => {
        if (window.confirm('Tem certeza que deseja excluir este local?')) {
            try {
                await api.deleteLocation(cod_local);
                await fetchLocations();
            } catch (error) {
                console.error('Failed to delete location:', error);
                alert(`${error}`);
            }
        }
    };

    const openModal = (location: Partial<Location> | null = null) => {
        setEditingLocation(location);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLocation(null);
    };

    return (
        <div className="container mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-700">Gerenciar Locais Físicos</h2>
                    <button onClick={() => openModal({})} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
                        Adicionar Novo Local
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Descrição</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map(location => (
                                <tr key={location.cod_local} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{location.cod_local}</td>
                                    <td className="p-3">{location.descricao}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${location.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {location.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="p-3 flex space-x-2">
                                        <button onClick={() => openModal(location)} className="text-blue-600 hover:text-blue-800">Editar</button>
                                        <button onClick={() => handleDeleteLocation(location.cod_local)} className="text-red-600 hover:text-red-800">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingLocation?.cod_local ? 'Editar Local' : 'Adicionar Novo Local'}>
                {editingLocation !== null && <LocationForm location={editingLocation} onSave={handleSaveLocation} onCancel={closeModal} />}
            </Modal>
        </div>
    );
};

export default LocationsPage;
