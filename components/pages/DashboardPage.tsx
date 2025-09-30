
import React, { useState, useEffect, useMemo } from 'react';
import { Asset, AssetStatus } from '../../types';
import * as api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAssets(await api.getAssets());
      } catch (error) {
        console.error("Failed to fetch assets for dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const total = assets.length;
    const inventoried = assets.filter(a => a.inventariado === 1).length;
    const notInventoried = total - inventoried;
    const active = assets.filter(a => a.situacao === AssetStatus.Ativo).length;
    const inactive = assets.filter(a => a.situacao === AssetStatus.Inativo).length;
    const writtenOff = assets.filter(a => a.situacao === AssetStatus.Baixado).length;

    return { total, inventoried, notInventoried, active, inactive, writtenOff };
  }, [assets]);

  const chartData = useMemo(() => {
    const locations = Array.from(new Set(assets.map(a => a.local_fisico)));
    const locationData: { name: string, total: number, inventoried: number }[] = [];
    
    // This is inefficient on large datasets, but fine for this mock.
    // In a real app, this aggregation would be done on the backend.
    api.getLocations().then(allLocations => {
      locations.forEach(locId => {
        const locationAssets = assets.filter(a => a.local_fisico === locId);
        const locationName = allLocations.find(l => l.cod_local === locId)?.descricao || `Local ${locId}`;
        locationData.push({
          name: locationName,
          total: locationAssets.length,
          inventoried: locationAssets.filter(a => a.inventariado === 1).length,
        });
      });
    });
    return locationData;
  }, [assets]);
  
  if (loading) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Total de Bens" value={stats.total} icon="📦" color="border-blue-500" />
        <DashboardCard title="Inventariados" value={stats.inventoried} icon="✅" color="border-green-500" />
        <DashboardCard title="Não Inventariados" value={stats.notInventoried} icon="📋" color="border-yellow-500" />
        <DashboardCard title="Bens Ativos" value={stats.active} icon="🟢" color="border-teal-500" />
        <DashboardCard title="Bens Inativos" value={stats.inactive} icon="🟠" color="border-orange-500" />
        <DashboardCard title="Bens Baixados" value={stats.writtenOff} icon="🔴" color="border-red-500" />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-4">Bens por Localização</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#3b82f6" name="Total de Bens" />
              <Bar dataKey="inventoried" fill="#22c55e" name="Inventariados" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
