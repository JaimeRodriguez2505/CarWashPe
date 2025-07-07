import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const EditCompany = () => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!user?.token) {
          setError('No hay token de autenticación');
          return;
        }

        const response = await api.get(`/api/empresas/${id}/`);
        setNombre(response.data.nombre);
      } catch (error) {
        setError('Error al obtener los detalles de la empresa.');
      }
    };

    if (user?.token) {
      fetchCompany();
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (!user?.token) {
        setError('No hay token de autenticación');
        return;
      }

      await api.put(`/api/empresas/${id}/`, { nombre });
      navigate('/companies');
    } catch (error) {
      setError('Error al actualizar la empresa. Por favor inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <motion.div
          whileHover={{ boxShadow: "0 0 25px rgba(220, 38, 38, 0.1)" }}
          className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-red-200/50"
        >
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mr-3 p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg"
              >
                <Building size={28} className="text-white" />
              </motion.div>
              Editar Empresa
            </motion.h2>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200 mb-6"
            >
              <AlertCircle size={16} className="mr-2" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                Nombre de la Empresa
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400" size={18} />
                <input
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 ease-in-out"
                  id="nombre"
                  type="text"
                  placeholder="Ingresa el nombre de la empresa"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 flex items-center justify-center shadow-lg"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {isLoading ? 'Actualizando...' : 'Actualizar Empresa'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/companies')}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 flex items-center shadow-lg"
              >
                <ArrowLeft size={20} className="mr-2" />
                Cancelar
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EditCompany;