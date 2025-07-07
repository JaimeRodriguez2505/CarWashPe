import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Edit, Trash2, Plus, AlertCircle, Car, DollarSign, CheckCircle, Clock, ChevronDown, ChevronUp, MapPin, FileText, TrendingUp } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const CompanyList = () => {
  const [company, setCompany] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCompany = async () => {
      try {
        const response = await api.get('/api/empresas/');
        if (response.data.length > 0) {
          setCompany(response.data[0]);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('No se pudo cargar la información de la empresa.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompany();
  }, [navigate, user, logout]);

  const fetchStatistics = async () => {
    if (!company) return;
    
    setLoadingStats(true);
    try {
      const response = await api.get(`/api/empresas/${company.id}/estadisticas/`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setError('No se pudieron cargar las estadísticas.');
    } finally {
      setLoadingStats(false);
    }
  };

  const handleStatsToggle = () => {
    setShowStats(!showStats);
    if (!showStats && !statistics) {
      fetchStatistics();
    }
  };

  const handleDelete = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar esta empresa?')) {
      try {
        await api.delete(`/api/empresas/${company.id}/`);
        setCompany(null);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('No se pudo eliminar la empresa.');
        }
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };

  const StatCard = ({ icon, title, value, subtitle, color = 'red' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );

  const InfoCard = ({ icon, title, value, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-red-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start space-x-3">
        <div className="text-red-600 mt-1 p-2 bg-red-50 rounded-lg">{icon}</div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
          <p className="text-gray-900 font-medium text-lg">{value}</p>
          {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-red-200/50"
      >
        <div className="p-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mr-4 p-3 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg"
            >
              <Building size={36} className="text-white" />
            </motion.div>
            Mi Empresa
          </h2>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center text-red-600 text-sm bg-red-50 p-3 rounded-xl mb-6 border border-red-200"
            >
              <AlertCircle size={18} className="mr-2" />
              {error}
            </motion.div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : company ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Header de la empresa */}
              <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-8 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{company.nombre}</h3>
                    <p className="text-red-100 text-lg">Sistema de Gestión de Lavado de Autos</p>
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <Building size={48} className="text-red-200" />
                  </motion.div>
                </div>
              </div>

              {/* Información de la empresa */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard
                  icon={<Building size={20} />}
                  title="Nombre de la Empresa"
                  value={company.nombre}
                  subtitle="Nombre registrado oficialmente"
                />
                
                {company.ruc && (
                  <InfoCard
                    icon={<FileText size={20} />}
                    title="RUC"
                    value={company.ruc}
                    subtitle="Registro Único de Contribuyentes"
                  />
                )}
                
                {company.direccion && (
                  <InfoCard
                    icon={<MapPin size={20} />}
                    title="Dirección"
                    value={company.direccion}
                    subtitle="Ubicación de la empresa"
                  />
                )}
              </div>

              {/* Botones de acción principales */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/companies/${company.id}/cars`)}
                  className="flex-1 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl hover:shadow-xl transition-all duration-300 text-lg font-semibold shadow-lg"
                >
                  <Car size={24} className="mr-3" />
                  Gestionar Carros
                </motion.button>
                
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/edit-company/${company.id}`)}
                    className="px-4 py-4 text-red-600 hover:text-red-800 transition duration-200 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl"
                    title="Editar empresa"
                  >
                    <Edit size={24} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className="px-4 py-4 text-red-600 hover:text-red-800 transition duration-200 bg-red-50 hover:bg-red-100 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl"
                    title="Eliminar empresa"
                  >
                    <Trash2 size={24} />
                  </motion.button>
                </div>
              </div>

              {/* Toggle para estadísticas */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStatsToggle}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-50 to-red-100 text-gray-800 rounded-xl flex items-center justify-center font-semibold hover:from-red-100 hover:to-red-200 transition-all duration-300 border border-red-200/50 shadow-lg"
                disabled={loadingStats}
              >
                {loadingStats ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mr-2"></div>
                    Cargando Estadísticas...
                  </>
                ) : (
                  <>
                    {showStats ? 'Ocultar Estadísticas' : 'Mostrar Estadísticas'}
                    {showStats ? <ChevronUp className="ml-2" /> : <ChevronDown className="ml-2" />}
                  </>
                )}
              </motion.button>

              {/* Estadísticas reales */}
              <AnimatePresence>
                {showStats && statistics && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 overflow-hidden"
                  >
                    {/* Estadísticas principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard 
                        icon={<Car size={24} />}
                        title="Carros Registrados"
                        value={statistics.carros_registrados}
                        subtitle="Total de carros en el sistema"
                        color="red"
                      />
                      <StatCard 
                        icon={<DollarSign size={24} />}
                        title="Ingresos Totales"
                        value={formatCurrency(statistics.ingresos_totales)}
                        subtitle="De carros terminados"
                        color="red"
                      />
                      <StatCard 
                        icon={<CheckCircle size={24} />}
                        title="Carros Terminados"
                        value={statistics.carros_terminados}
                        subtitle="Trabajos completados"
                        color="red"
                      />
                      <StatCard 
                        icon={<Clock size={24} />}
                        title="Carros Pendientes"
                        value={statistics.carros_pendientes}
                        subtitle="En espera y proceso"
                        color="red"
                      />
                    </div>

                    {/* Estadísticas adicionales */}
                    {statistics.carros_terminados > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <StatCard 
                          icon={<TrendingUp size={24} />}
                          title="Promedio por Carro"
                          value={formatCurrency(statistics.promedio_por_carro)}
                          subtitle="Ingreso promedio por servicio"
                          color="red"
                        />
                        <StatCard 
                          icon={<Car size={24} />}
                          title="Carros Último Mes"
                          value={statistics.carros_ultimo_mes}
                          subtitle="Últimos 30 días"
                          color="red"
                        />
                      </div>
                    )}

                    {/* Distribución por estado */}
                    {statistics.stats_por_estado.length > 0 && (
                      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-red-200/50 shadow-lg">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                          <CheckCircle className="mr-2 text-red-600" size={20} />
                          Distribución por Estado
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {statistics.stats_por_estado.map((stat) => (
                            <div key={stat.estado} className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{stat.cantidad}</div>
                              <div className="text-sm text-gray-600 capitalize">
                                {stat.estado === 'espera' ? 'En Espera' : 
                                 stat.estado === 'proceso' ? 'En Proceso' : 
                                 'Terminado'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Información adicional */}
              <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-red-200/50 shadow-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Información del Sistema</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Usuario:</span> {user?.username || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Rol:</span> {user?.is_staff ? 'Administrador' : 'Usuario'}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium">Estado:</span> <span className="text-green-600">Activo</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="mx-auto mb-4 p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg"
              >
                <Building size={64} className="text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Aún no has registrado una empresa</h3>
              <p className="text-gray-600 mb-8">Comienza a optimizar tu negocio de lavado de autos registrando tu empresa ahora.</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/add-company"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 text-lg shadow-lg"
                >
                  <Plus size={24} className="mr-2" />
                  Registrar Empresa
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyList;

