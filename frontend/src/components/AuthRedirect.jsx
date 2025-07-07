import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Building, Home, Car, Crown, User } from 'lucide-react';
import { getUser, isAuthenticated, isAdmin } from '../utils/auth';

const AuthRedirect = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectMessage, setRedirectMessage] = useState('');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        setIsLoading(true);
        
        // Pequeña pausa para mostrar el loading
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (isAuthenticated()) {
          const user = getUser();
          
          if (isAdmin()) {
            setRedirectMessage('Redirigiendo al Panel de Administración...');
            await new Promise(resolve => setTimeout(resolve, 500));
            navigate('/admin', { replace: true });
          } else {
            setRedirectMessage('Redirigiendo a tu empresa...');
            await new Promise(resolve => setTimeout(resolve, 500));
            navigate('/companies', { replace: true });
          }
        } else {
          setRedirectMessage('Redirigiendo al inicio...');
          await new Promise(resolve => setTimeout(resolve, 500));
          navigate('/home', { replace: true });
        }
      } catch (error) {
        console.error('Error during redirect:', error);
        navigate('/home', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    handleRedirect();
  }, [navigate]);

  if (!isLoading) {
    return null;
  }

  const user = getUser();
  const userIsAdmin = user && isAdmin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 relative overflow-hidden">
      {/* Efectos de fondo animados */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-red-400/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10"
      >
        {/* Tarjeta principal con glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-red-200/50 max-w-md mx-auto">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex items-center justify-center mb-8 p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg"
          >
            {userIsAdmin ? (
              <Crown className="w-12 h-12 text-white" />
            ) : isAuthenticated() ? (
              <Building className="w-12 h-12 text-white" />
            ) : (
              <Car className="w-12 h-12 text-white" />
            )}
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            {userIsAdmin ? 'Bienvenido, Administrador' : 
             isAuthenticated() ? `Bienvenido, ${user?.username || 'Usuario'}` : 
             'Bienvenido a CarWashPe'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8 text-lg"
          >
            {redirectMessage || 'Cargando...'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-200 border-t-red-600"></div>
          </motion.div>

          {/* Información adicional según el tipo de usuario */}
          {userIsAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border border-amber-200"
            >
              <Crown className="w-4 h-4 mr-2" />
              Acceso de Administrador
            </motion.div>
          )}

          {isAuthenticated() && !userIsAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"
            >
              <User className="w-4 h-4 mr-2" />
              Usuario Registrado
            </motion.div>
          )}

          {!isAuthenticated() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300"
            >
              <Car className="w-4 h-4 mr-2" />
              Visitante
            </motion.div>
          )}
        </div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            CarWashPe - Sistema de Gestión Profesional
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthRedirect;
