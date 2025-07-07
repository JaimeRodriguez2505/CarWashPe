import React from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isAdmin, isAuthenticated } from '../utils/auth';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero no es admin, mostrar página de acceso denegado
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <AlertTriangle className="w-24 h-24 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600">No tienes permisos de administrador para acceder a esta página.</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-600">Área Restringida</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Esta sección está reservada únicamente para administradores del sistema.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Volver Atrás
              </button>
              <button
                onClick={() => window.location.href = '/companies'}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Ir a Mi Empresa
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <p className="text-xs text-gray-400">
              Si crees que esto es un error, contacta al administrador del sistema.
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Si es admin, renderizar el componente
  return children;
};

export default AdminRoute; 