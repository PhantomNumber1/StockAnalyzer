import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { StockProvider } from './contexts/StockContext';
import { UserProvider } from './contexts/UserContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/Layout';
// Protected route component
const ProtectedRoute = ({
  children
}) => {
  const {
    currentUser
  } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
// Admin route component
const AdminRoute = ({
  children
}) => {
  const {
    currentUser
  } = useAuth();
  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};
export function App() {
  return <Router>
      <AuthProvider>
        <StockProvider>
          <UserProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="stock/:stockId" element={<StockDetail />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="admin" element={<AdminRoute>
                      <AdminPanel />
                    </AdminRoute>} />
              </Route>
            </Routes>
          </UserProvider>
        </StockProvider>
      </AuthProvider>
    </Router>;
}