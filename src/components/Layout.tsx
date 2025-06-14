import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, PieChart, Clock, Settings, LogOut, Users } from 'lucide-react';
const Layout = () => {
  const {
    currentUser,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Mock Stocks</h1>
          <p className="text-sm text-gray-500">Indian Market Simulator</p>
        </div>
        <nav className="mt-6">
          <NavLink to="/dashboard" className={({
          isActive
        }) => `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}>
            <TrendingUp className="w-5 h-5 mr-3" />
            <span>Market Dashboard</span>
          </NavLink>
          <NavLink to="/portfolio" className={({
          isActive
        }) => `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}>
            <PieChart className="w-5 h-5 mr-3" />
            <span>My Portfolio</span>
          </NavLink>
          <NavLink to="/transactions" className={({
          isActive
        }) => `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}>
            <Clock className="w-5 h-5 mr-3" />
            <span>Transactions</span>
          </NavLink>
          {currentUser && currentUser.isAdmin && <NavLink to="/admin" className={({
          isActive
        }) => `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}>
              <Users className="w-5 h-5 mr-3" />
              <span>Admin Panel</span>
            </NavLink>}
        </nav>
        <div className="absolute bottom-0 w-64 border-t p-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-500">{currentUser?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
            <LogOut className="w-4 h-4 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>;
};
export default Layout;