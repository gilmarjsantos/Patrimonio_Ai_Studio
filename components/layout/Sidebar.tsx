
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navLinkClasses = "flex items-center px-4 py-3 text-gray-200 hover:bg-blue-800 rounded-lg transition-colors duration-200";
    const activeNavLinkClasses = "bg-blue-900 font-bold";

    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
        `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`;

    return (
        <aside className="hidden md:flex flex-col w-64 bg-primary text-white">
            <div className="flex items-center justify-center h-20 border-b border-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-blue-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-2xl font-bold">Patrimônio</span>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                <NavLink to="/" className={getNavLinkClass} end>
                    <IconDashboard /> <span className="ml-3">Dashboard</span>
                </NavLink>
                <NavLink to="/assets" className={getNavLinkClass}>
                    <IconAssets /> <span className="ml-3">Bens</span>
                </NavLink>
                <NavLink to="/locations" className={getNavLinkClass}>
                    <IconLocations /> <span className="ml-3">Locais Físicos</span>
                </NavLink>
                <NavLink to="/users" className={getNavLinkClass}>
                    <IconUsers /> <span className="ml-3">Usuários</span>
                </NavLink>
                <NavLink to="/scanner" className={getNavLinkClass}>
                    <IconScanner /> <span className="ml-3">Escanear</span>
                </NavLink>
            </nav>
        </aside>
    );
};

// SVG Icons
const IconDashboard = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const IconAssets = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const IconLocations = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292" /></svg>;
const IconScanner = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h-1m-1 6v-1M4 12H3m1-6V4m6 1h1m7 1h-1M7 4v1m-1 7H5m1 7v-1m6-15h1a2 2 0 012 2v1m-1 14h-1a2 2 0 01-2-2v-1m15-1h-1a2 2 0 01-2-2v-1m-1-14h1a2 2 0 012 2v1M4 7h1a2 2 0 002-2V4m-1 15v-1a2 2 0 00-2-2H4m15-1v1a2 2 0 01-2 2h-1" /></svg>;

export default Sidebar;
