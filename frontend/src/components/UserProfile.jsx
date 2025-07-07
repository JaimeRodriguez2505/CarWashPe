import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit, Key, Bell, Clock, CreditCard, Trash2, AlertCircle, Plus, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!authUser?.token) {
          navigate('/login');
          return;
        }

        const response = await api.get('/api/customers/');
        
        if (response.data && !response.data.error) {
          setUser(response.data);
          setHasProfile(true);
        } else {
          setHasProfile(false);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setHasProfile(false);
        } else {
          setError('Error al cargar los datos del usuario');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, authUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6 flex items-center justify-center">
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
                onClick={() => navigate('/create-customer')}
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.h1
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
            Mi Perfil
          </motion.h1>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 mb-6 border border-red-200/50"
        >
          <div className="flex items-center mb-6">
            <div className="p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg mr-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileItem icon={<Mail />} label="Email" value={user.email} />
            <ProfileItem icon={<Phone />} label="Teléfono" value={user.phone_number || 'No especificado'} />
            <ProfileItem icon={<MapPin />} label="Dirección" value={user.address || 'No especificada'} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <ActionButton icon={<Edit />} label="Editar Perfil" onClick={() => navigate('/edit-profile')} />
          <ActionButton icon={<Key />} label="Cambiar Contraseña" onClick={() => navigate('/change-password')} />
          <ActionButton icon={<Bell />} label="Preferencias de Notificación" onClick={() => navigate('/notification-preferences')} />
          <ActionButton icon={<Clock />} label="Historial de Actividad" onClick={() => navigate('/activity-history')} />
          <ActionButton icon={<CreditCard />} label="Gestionar Suscripción" onClick={() => navigate('/manage-subscription')} />
          <ActionButton 
            icon={<Trash2 />} 
            label="Eliminar Cuenta" 
            onClick={() => {/* Implement account deletion logic */}} 
            className="bg-red-600 hover:bg-red-700 text-white" 
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-red-200/50">
    <div className="p-2 bg-red-50 rounded-lg mr-3">
      {React.cloneElement(icon, { className: "w-5 h-5 text-red-600" })}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const ActionButton = ({ icon, label, onClick, className = "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white" }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center justify-center px-6 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-semibold ${className}`}
  >
    {React.cloneElement(icon, { className: "w-5 h-5 mr-2" })}
    {label}
  </motion.button>
);

export default UserProfile;

