import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Filter, Calendar, User, Mail, Clock, Eye, Reply, CheckCircle, XCircle, AlertCircle, Plus, Download, RefreshCw, Star, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../api';
import AdminReclamoResponder from './AdminReclamoResponder';

const estadoColor = {
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  atendido: 'bg-blue-100 text-blue-800 border-blue-200',
  cerrado: 'bg-green-100 text-green-800 border-green-200',
};

const estadoIcon = {
  pendiente: <AlertCircle className="w-4 h-4" />,
  atendido: <Clock className="w-4 h-4" />,
  cerrado: <CheckCircle className="w-4 h-4" />,
};

const AdminReclamosList = () => {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reclamoResponder, setReclamoResponder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');
  const [selectedReclamo, setSelectedReclamo] = useState(null);

  useEffect(() => {
    const fetchReclamos = async () => {
      try {
        const res = await api.get('/api/admin/reclamos/');
        setReclamos(res.data);
      } catch (err) {
        setError('No se pudieron cargar los reclamos.');
      } finally {
        setLoading(false);
      }
    };
    fetchReclamos();
  }, []);

  const filteredReclamos = reclamos.filter(reclamo => {
    const matchesSearch = reclamo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamo.mensaje?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterEstado === 'all' || reclamo.estado === filterEstado;
    
    return matchesSearch && matchesFilter;
  });

  const getEstadisticas = () => {
    const total = reclamos.length;
    const pendientes = reclamos.filter(r => r.estado === 'pendiente').length;
    const atendidos = reclamos.filter(r => r.estado === 'atendido').length;
    const cerrados = reclamos.filter(r => r.estado === 'cerrado').length;
    
    return { total, pendientes, atendidos, cerrados };
  };

  const stats = getEstadisticas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-red-200 shadow-2xl mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-red-800 via-red-700 to-red-600 bg-clip-text text-transparent mb-2 flex items-center"
                whileHover={{ scale: 1.02 }}
              >
                <MessageSquare className="w-8 h-8 mr-3 text-red-600" />
                Gestión de Reclamos
              </motion.h1>
              <p className="text-gray-600 text-lg">
                Administra y responde todos los reclamos de los usuarios
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Reclamo
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { title: 'Total', value: stats.total, icon: <MessageSquare className="w-6 h-6" />, color: 'from-red-500 to-red-600' },
            { title: 'Pendientes', value: stats.pendientes, icon: <AlertCircle className="w-6 h-6" />, color: 'from-yellow-500 to-yellow-600' },
            { title: 'Atendidos', value: stats.atendidos, icon: <Clock className="w-6 h-6" />, color: 'from-blue-500 to-blue-600' },
            { title: 'Cerrados', value: stats.cerrados, icon: <CheckCircle className="w-6 h-6" />, color: 'from-green-500 to-green-600' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
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
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-red-200 shadow-2xl mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar reclamos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-500"
              />
            </div>
            
            {/* Filtro por estado */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 appearance-none"
              >
                <option value="all">Todos los estados</option>
                <option value="pendiente">Pendientes</option>
                <option value="atendido">Atendidos</option>
                <option value="cerrado">Cerrados</option>
              </select>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-700">{filteredReclamos.length}</div>
                <div className="text-sm text-gray-600">reclamos encontrados</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lista de reclamos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-red-200 shadow-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600">Cargando reclamos...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-red-50 to-red-100 border-b border-red-200">
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Fecha</th>
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Usuario</th>
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Estado</th>
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Mensaje</th>
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Respuesta</th>
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredReclamos.map((reclamo, index) => (
                      <motion.tr
                        key={reclamo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                        className="border-b border-red-100 hover:bg-red-50/50 transition-all duration-300"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-gray-700">
                              {new Date(reclamo.fecha).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {new Date(reclamo.fecha).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold mr-3"
                            >
                              {reclamo.nombre?.charAt(0) || 'U'}
                            </motion.div>
                            <div>
                              <div className="font-semibold text-gray-800">{reclamo.nombre}</div>
                              <div className="text-sm text-gray-600 flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {reclamo.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${estadoColor[reclamo.estado] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
                          >
                            {estadoIcon[reclamo.estado]}
                            <span className="ml-1">
                              {reclamo.estado.charAt(0).toUpperCase() + reclamo.estado.slice(1)}
                            </span>
                          </motion.div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="max-w-xs">
                            <p className="text-gray-700 text-sm line-clamp-2" title={reclamo.mensaje}>
                              {reclamo.mensaje}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="max-w-xs">
                            {reclamo.respuesta ? (
                              <p className="text-gray-700 text-sm line-clamp-2" title={reclamo.respuesta}>
                                {reclamo.respuesta}
                              </p>
                            ) : (
                              <span className="italic text-gray-400 text-sm">Sin respuesta</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              onClick={() => setSelectedReclamo(reclamo)}
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              onClick={() => setReclamoResponder(reclamo)}
                            >
                              <Reply className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Paginación */}
        {filteredReclamos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex items-center justify-between bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-red-200 shadow-2xl"
          >
            <div className="text-gray-600">
              Mostrando {filteredReclamos.length} de {reclamos.length} reclamos
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-200 text-red-700 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300"
              >
                Anterior
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Siguiente
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Modal de respuesta */}
        {reclamoResponder && (
          <AdminReclamoResponder 
            reclamo={reclamoResponder} 
            onResponded={updated => {
              setReclamos(reclamos.map(x => x.id === updated.id ? updated : x));
              setReclamoResponder(null);
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default AdminReclamosList;
