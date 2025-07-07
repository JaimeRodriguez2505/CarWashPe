import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, LogIn, ArrowRight, Shield, Car, Zap, Eye, EyeOff, CheckCircle, Sparkles, Waves, Droplets } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ username: false, password: false });
  const navigate = useNavigate();
  const { login } = useAuth();

  // Efecto para partículas flotantes
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-red-400/30 rounded-full pointer-events-none';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = '100%';
      particle.style.animation = `float ${Math.random() * 3 + 2}s linear infinite`;
      document.querySelector('.particle-container')?.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 5000);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setRedirectMessage('');
    
    try {
      const response = await axios.post('http://localhost:8000/login', { username, password });
      const userData = { ...response.data.user, token: response.data.token };
      
      login(userData);
      
      const isAdmin = userData.is_staff || userData.is_superuser;
      
      if (isAdmin) {
        setRedirectMessage('¡Bienvenido, Administrador! Redirigiendo al panel de administración...');
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else {
        setRedirectMessage('¡Inicio de sesión exitoso! Redirigiendo a tu empresa...');
        setTimeout(() => {
          navigate('/companies');
        }, 1500);
      }
    } catch (err) {
      setError('Nombre de usuario o contraseña inválidos');
      console.error('Error de inicio de sesión:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-white via-red-50 to-red-100">
      {/* Partículas flotantes */}
      <div className="particle-container absolute inset-0 overflow-hidden pointer-events-none" />
      
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

      {/* Contenedor principal */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-md relative z-10 p-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-red-200/50 overflow-hidden"
        >
          {/* Efecto de brillo en el fondo */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-red-600/5 to-red-400/5 rounded-3xl blur-xl"
          />

          {/* Header con animación mejorada */}
          <div className="text-center mb-8 relative z-10">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
                y: [0, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-flex items-center justify-center mb-6 p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg relative overflow-hidden"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-500/20 rounded-2xl"
              />
              <Car className="w-8 h-8 text-white relative z-10" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold bg-gradient-to-r from-red-800 via-red-700 to-red-600 bg-clip-text text-transparent mb-2"
            >
              Bienvenido de vuelta
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600"
            >
              Inicia sesión para acceder a tu cuenta
            </motion.p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Campo de usuario */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre de usuario
              </label>
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
              >
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-red-200 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-500"
                  placeholder="Ingresa tu nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, username: true })}
                  onBlur={() => setIsFocused({ ...isFocused, username: false })}
                  disabled={isLoading}
                />
                <AnimatePresence>
                  {isFocused.username && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
            
            {/* Campo de contraseña */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
              >
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500" size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-red-200 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-500"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                  disabled={isLoading}
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
                <AnimatePresence>
                  {isFocused.password && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-xl pointer-events-none"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Mensajes de error y éxito */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="text-red-600 text-sm text-center bg-red-50 backdrop-blur-sm p-3 rounded-xl border border-red-200 flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {error}
                </motion.div>
              )}

              {redirectMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="text-green-600 text-sm text-center bg-green-50 backdrop-blur-sm p-3 rounded-xl border border-green-200 flex items-center justify-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {redirectMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón de envío */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 flex items-center justify-center text-lg font-bold rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 shadow-2xl hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-500/20"
                />
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full relative z-10"
                  />
                ) : (
                  <LogIn className="mr-2 relative z-10" size={20} />
                )}
                <span className="relative z-10">
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </span>
              </motion.button>
            </motion.div>
          </form>
          
          {/* Enlaces adicionales */}
          {!isLoading && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-center relative z-10"
              >
                <motion.a 
                  href="#" 
                  whileHover={{ scale: 1.05 }}
                  className="text-sm text-red-600 hover:text-red-700 transition-all duration-300 hover:underline inline-flex items-center"
                >
                  <Droplets className="w-3 h-3 mr-1" />
                  ¿Olvidaste tu contraseña?
                </motion.a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-center relative z-10"
              >
                <span className="text-gray-600">¿No tienes una cuenta?</span>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/register" 
                    className="ml-2 text-red-600 hover:text-red-700 transition-all duration-300 inline-flex items-center font-semibold"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Regístrate
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Estilos CSS para las partículas */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;