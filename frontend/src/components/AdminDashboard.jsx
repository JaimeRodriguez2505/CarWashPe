import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  Target, 
  BarChart3, 
  PieChart, 
  Activity, 
  Zap, 
  Shield, 
  Crown, 
  Building, 
  UserCheck, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw,
  Bell,
  MessageSquare,
  FileText,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Datos de ejemplo
  const stats = [
    { title: 'Total Usuarios', value: '1,247', change: '+12%', icon: <Users className="w-6 h-6" />, color: 'from-red-500 to-red-600' },
    { title: 'Servicios Hoy', value: '89', change: '+8%', icon: <Car className="w-6 h-6" />, color: 'from-red-600 to-red-700' },
    { title: 'Ingresos Mensuales', value: '$45,230', change: '+15%', icon: <DollarSign className="w-6 h-6" />, color: 'from-red-700 to-red-800' },
    { title: 'Crecimiento', value: '23%', change: '+5%', icon: <TrendingUp className="w-6 h-6" />, color: 'from-red-500 to-red-600' }
  ];

  const recentActivity = [
    { type: 'user', action: 'Nuevo usuario registrado', user: 'Juan Pérez', time: '2 min', status: 'success' },
    { type: 'service', action: 'Servicio completado', user: 'María García', time: '5 min', status: 'success' },
    { type: 'payment', action: 'Pago procesado', user: 'Carlos López', time: '12 min', status: 'success' },
    { type: 'error', action: 'Error en el sistema', user: 'Sistema', time: '1 hora', status: 'error' },
    { type: 'user', action: 'Usuario actualizado', user: 'Ana Silva', time: '2 horas', status: 'success' }
  ];

  const quickActions = [
    { title: 'Agregar Usuario', icon: <UserCheck className="w-6 h-6" />, color: 'from-red-500 to-red-600', action: () => console.log('Add user') },
    { title: 'Ver Reportes', icon: <BarChart3 className="w-6 h-6" />, color: 'from-red-600 to-red-700', action: () => console.log('View reports') },
    { title: 'Configuración', icon: <Settings className="w-6 h-6" />, color: 'from-red-700 to-red-800', action: () => console.log('Settings') },
    { title: 'Soporte', icon: <MessageSquare className="w-6 h-6" />, color: 'from-red-500 to-red-600', action: () => console.log('Support') }
  ];

  const notifications = [
    { type: 'info', message: 'Nuevo usuario registrado: Juan Pérez', time: '2 min' },
    { type: 'success', message: 'Sistema actualizado exitosamente', time: '1 hora' },
    { type: 'warning', message: 'Alto tráfico en el servidor', time: '3 horas' },
    { type: 'error', message: 'Error en la base de datos', time: '5 horas' }
  ];

  // Efecto para partículas flotantes
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-red-400/20 rounded-full pointer-events-none';
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

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <Bell className="w-4 h-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 relative overflow-hidden">
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

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-xl shadow-2xl border-b border-red-200/50 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center text-2xl font-bold bg-gradient-to-r from-red-800 via-red-700 to-red-600 bg-clip-text text-transparent">
                  <motion.div
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="mr-3 p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg"
                  >
                    <Crown className="w-8 h-8 text-white" />
                  </motion.div>
                  <span>Admin Panel</span>
                </div>
              </motion.div>

              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs de navegación */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex space-x-1 bg-white/60 backdrop-blur-xl rounded-2xl p-2 mb-8 border border-red-200"
          >
            {['overview', 'users', 'services', 'reports', 'settings'].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                    : 'text-gray-700 hover:text-red-600 hover:bg-white/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          {/* Estadísticas principales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-red-200 shadow-2xl hover:shadow-3xl transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className={`p-3 bg-gradient-to-r ${stat.color} rounded-2xl shadow-lg`}
                  >
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </motion.div>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-sm">{stat.title}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Acciones rápidas */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-red-200 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-red-600" />
                  Acciones Rápidas
                </h3>
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.action}
                      className="w-full flex items-center p-4 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 rounded-2xl transition-all duration-300 border border-red-200"
                    >
                      <div className={`p-2 bg-gradient-to-r ${action.color} rounded-xl mr-4`}>
                        <div className="text-white">
                          {action.icon}
                        </div>
                      </div>
                      <span className="font-semibold text-gray-800">{action.title}</span>
                      <ArrowRight className="w-4 h-4 ml-auto text-red-600" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Actividad reciente */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-red-200 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-red-600" />
                    Actividad Reciente
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center text-sm text-red-600 hover:text-red-700 font-semibold"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Actualizar
                  </motion.button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="flex items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200"
                    >
                      <div className="flex-shrink-0 mr-4">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.user}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {activity.time}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Notificaciones */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8"
          >
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-red-200 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-red-600" />
                Notificaciones del Sistema
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-2xl border border-red-200"
                  >
                    <div className="flex-shrink-0 mr-4">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{notification.message}</p>
                      <p className="text-sm text-gray-600">{notification.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

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

export default AdminDashboard;
