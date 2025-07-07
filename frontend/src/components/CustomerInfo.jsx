import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, Calendar, Loader2, AlertCircle, Plus, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const CustomerInfo = () => {
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        if (!user?.token) {
          throw new Error('No hay token de autenticación');
        }

        const response = await api.get('/api/customers');
        if (response.data && !response.data.error) {
          setCustomerData(response.data);
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      } catch (err) {
        console.error('Error al obtener datos del cliente:', err);
        if (err.response?.status === 404) {
          setHasProfile(false);
        } else if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else if (err.message) {
          setError(err.message);
        } else {
          setError('Ocurrió un error al cargar los datos del cliente');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
      fetchCustomerData();
    } else {
      setIsLoading(false);
      setError('No hay token de autenticación');
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex justify-center items-center">
        <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-red-200/50">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <p className="text-gray-700">Cargando información del cliente...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-red-200/50 max-w-md w-full"
        >
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle size={24} className="mr-2" />
            <span className="font-semibold">Error</span>
          </div>
          <p className="text-gray-700">{error}</p>
        </motion.div>
      </div>
    );
  }

  // Si no hay perfil de cliente, mostrar mensaje grande
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            whileHover={{ boxShadow: "0 0 25px rgba(220, 38, 38, 0.1)" }}
            className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-red-200/50"
          >
            {/* Icono grande animado */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mx-auto mb-8 p-6 bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-lg w-24 h-24 flex items-center justify-center"
            >
              <UserCheck size={48} className="text-white" />
            </motion.div>

            {/* Mensaje principal */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-800 mb-4"
            >
              ¡No tienes aún completado tu registro!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-600 mb-8 leading-relaxed"
            >
              Para disfrutar de todos los beneficios de CarWash Pe, necesitamos que completes tu información personal. 
              Esto nos ayudará a brindarte un mejor servicio.
            </motion.p>

            {/* Botón grande */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/createCustomerForm')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xl rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Plus size={28} className="mr-3" />
                Completar Información
              </motion.button>
            </motion.div>

            {/* Información adicional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 p-4 bg-red-50 rounded-xl border border-red-200"
            >
              <p className="text-sm text-gray-600">
                <strong>¿Por qué necesitamos esta información?</strong><br />
                Para procesar pagos, enviar notificaciones importantes y brindarte un servicio personalizado.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Si hay perfil, mostrar la información normal
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  const handleUpdateClick = () => {
    navigate('/update-customer'); // Navega a la página de actualización
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mr-4 p-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg"
            >
              <User size={36} className="text-white" />
            </motion.div>
            Información del Cliente
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-red-200/50"
        >
          <div className="p-8">
            <div className="space-y-6">
              <InfoItem 
                icon={<User className="text-red-600" />} 
                label="Nombre" 
                value={`${customerData.first_name || 'No disponible'} ${customerData.last_name || ''}`}
              />
              <InfoItem 
                icon={<Mail className="text-red-600" />} 
                label="Correo" 
                value={customerData.email || 'No disponible'}
              />
              <InfoItem 
                icon={<Phone className="text-red-600" />} 
                label="Teléfono" 
                value={customerData.phone_number || 'No disponible'}
              />
              <InfoItem 
                icon={<MapPin className="text-red-600" />} 
                label="Dirección" 
                value={customerData.address && customerData.address_city ? 
                  `${customerData.address}, ${customerData.address_city}` : 
                  'No disponible'
                }
              />
              <InfoItem 
                icon={<Globe className="text-red-600" />} 
                label="Código de País" 
                value={customerData.country_code || 'No disponible'}
              />
              <InfoItem 
                icon={<Calendar className="text-red-600" />} 
                label="Fecha de Creación" 
                value={formatDate(customerData.creation_date)}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdateClick}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
              >
                Actualizar Información
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-red-200/50 hover:bg-white/70 transition-all duration-300">
    <div className="p-2 bg-red-50 rounded-lg mr-4">
      {icon}
    </div>
    <div className="flex-1">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 font-semibold">{value}</dd>
    </div>
  </div>
);

export default CustomerInfo;
