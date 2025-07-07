import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building, ArrowLeft, Plus, AlertCircle, MapPin, Loader2 } from 'lucide-react';
import api from '../api';

const AddCompany = () => {
  const [nombre, setNombre] = useState('');
  const [ruc, setRuc] = useState('');
  const [direccion, setDireccion] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetLocation = async () => {
    setIsLocating(true);
    setError('');
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada en este navegador.');
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        // Usar Nominatim para geocodificación inversa
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        setDireccion(data.display_name || `${latitude}, ${longitude}`);
      } catch (e) {
        setError('No se pudo obtener la dirección automáticamente.');
      } finally {
        setIsLocating(false);
      }
    }, (err) => {
      setError('No se pudo obtener la ubicación: ' + err.message);
      setIsLocating(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/api/empresas/', { nombre, ruc, direccion });
      navigate('/companies');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setError('Autenticación fallida. Por favor, inicia sesión de nuevo.');
      } else {
        setError('No se pudo agregar la empresa. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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
              Agregar Nueva Empresa
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600"
            >
              Ingresa los detalles de la nueva empresa
            </motion.p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Empresa
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400" size={18} />
                <input
                  id="nombre"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 ease-in-out"
                  placeholder="Ingresa el nombre de la empresa"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label htmlFor="ruc" className="block text-sm font-medium text-gray-700 mb-1">
                RUC (opcional)
              </label>
              <input
                id="ruc"
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 ease-in-out"
                placeholder="Ingresa el RUC de la empresa"
                value={ruc}
                onChange={(e) => setRuc(e.target.value)}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <div className="flex gap-2">
                <input
                  id="direccion"
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-white/50 backdrop-blur-sm border border-red-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 ease-in-out"
                  placeholder="Ingresa la dirección o usa el botón"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
                <motion.button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 shadow-lg"
                  title="Obtener mi ubicación"
                >
                  {isLocating ? <Loader2 className="animate-spin mr-1" size={18} /> : <MapPin className="mr-1" size={18} />}
                  {isLocating ? 'Ubicando...' : 'Ubicación'}
                </motion.button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
              >
                <AlertCircle size={16} className="mr-2" />
                {error}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 flex items-center justify-center text-lg font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Plus className="mr-2" size={20} />
                )}
                {isLoading ? 'Agregando...' : 'Agregar Empresa'}
              </motion.button>
            </motion.div>
          </form>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-center"
          >
            <Link
              to="/companies"
              className="text-red-600 hover:text-red-800 transition duration-200 flex items-center justify-center"
            >
              <ArrowLeft size={20} className="mr-1" />
              Volver a Empresas
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddCompany;

