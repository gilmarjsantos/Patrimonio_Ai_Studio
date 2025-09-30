
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../types';
import * as api from '../../services/api';
import Modal from '../common/Modal';

const UserForm: React.FC<{
  user: Partial<User> | null;
  onSave: (user: User | Omit<User, 'id'|'data_cadastro'>) => void;
  onCancel: () => void;
}> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    nome: '',
    login: '',
    email: '',
    situacao: 1,
    matricula: '',
    ...user
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.login || !formData.email) {
      alert('Campos Nome, Login e E-mail são obrigatórios.');
      return;
    }
    // Note: Password handling would be here in a real app.
    onSave(formData as User);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome Completo*</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Login*</label>
          <input type="text" name="login" value={formData.login} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail*</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Matrícula (Opcional)</label>
          <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="situacao" id="situacao" checked={formData.situacao === 1} onChange={handleChange} className="h-4 w-4 text-secondary border-gray-300 rounded" />
        <label htmlFor="situacao" className="ml-2 block text-sm text-gray-900">Ativo</label>
      </div>
       <p className="text-xs text-gray-500">A senha será definida como 'password' por padrão.</p>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-blue-700">Salvar</button>
      </div>
    </form>
  );
};


const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            setUsers(await api.getUsers());
        } catch (error) {
            console.error('Failed to fetch users:', error);
            alert('Falha ao carregar usuários.');
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    
    const handleSaveUser = async (userData: User | Omit<User, 'id' | 'data_cadastro'>) => {
        try {
            if ('id' in userData && userData.id) {
                await api.updateUser(userData as User);
            } else {
                await api.addUser(userData);
            }
            await fetchUsers();
            closeModal();
        } catch (error) {
            console.error('Failed to save user:', error);
            alert(`Falha ao salvar usuário: ${error}`);
        }
    };

    const openModal = (user: Partial<User> | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="container mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-700">Gerenciar Usuários</h2>
                    <button onClick={() => openModal({})} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-800">
                        Adicionar Novo Usuário
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Nome</th>
                                <th className="p-3">Login</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{user.nome}</td>
                                    <td className="p-3">{user.login}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.situacao ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.situacao ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <button onClick={() => openModal(user)} className="text-blue-600 hover:text-blue-800">Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingUser?.id ? 'Editar Usuário' : 'Adicionar Novo Usuário'}>
                {editingUser !== null && <UserForm user={editingUser} onSave={handleSaveUser} onCancel={closeModal} />}
            </Modal>
        </div>
    );
};

export default UsersPage;
