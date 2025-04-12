import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const isAuth = useSelector(state => state.user.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />}
      />
      
      <Route path="/register" element={<Register />} />
      
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          isAuth
            ? <Dashboard />
            : <Navigate to="/login" replace />
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}