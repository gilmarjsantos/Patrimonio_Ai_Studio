
import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/pages/LoginPage';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './components/pages/DashboardPage';
import AssetsPage from './components/pages/AssetsPage';
import LocationsPage from './components/pages/LocationsPage';
import UsersPage from './components/pages/UsersPage';
import ScannerPage from './components/pages/ScannerPage';

const ProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout />;
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/assets': return 'Bens Patrimoniais';
      case '/locations': return 'Locais Físicos';
      case '/users': return 'Usuários';
      case '/scanner': return 'Leitor de Código de Barras';
      default:
        if (location.pathname.startsWith('/assets/')) return 'Detalhes do Bem';
        return 'Controle de Patrimônio';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getTitle()} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedRoute />}>
            <Route index element={<DashboardPage />} />
            <Route path="assets" element={<AssetsPage />} />
            <Route path="assets/:code" element={<AssetsPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="scanner" element={<ScannerPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
