import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, User, Mail, Shield, Crown, Eye, Edit, Trash2, Plus, RefreshCw, Download, Star, CheckCircle, XCircle } from 'lucide-react';
import api from '../api';

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/api/admin/users/');
        setUsers(res.data);
      } catch (err) {
        setError('No se pudieron cargar los usuarios.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterRole === 'all' || 
                         (filterRole === 'staff' && user.is_staff) ||
                         (filterRole === 'superuser' && user.is_superuser) ||
                         (filterRole === 'regular' && !user.is_staff && !user.is_superuser);
    
    return matchesSearch && matchesFilter;
  });

  const getRoleBadge = (user) => {
    if (user.is_superuser) {
      return (
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full font-semibold"
        >
          <Crown className="w-3 h-3 mr-1" />
          Super Admin
        </motion.span>
      );
    } else if (user.is_staff) {
      return (
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full font-semibold"
        >
          <Shield className="w-3 h-3 mr-1" />
          Staff
        </motion.span>
      );
    } else {
      return (
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs rounded-full font-semibold"
        >
          <User className="w-3 h-3 mr-1" />
          Usuario
        </motion.span>
      );
    }
  };

  const getStatusIcon = (user) => {
    if (user.is_active) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

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
                <Users className="w-8 h-8 mr-3 text-red-600" />
                Gestión de Usuarios
              </motion.h1>
              <p className="text-gray-600 text-lg">
                Administra todos los usuarios registrados en la plataforma
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Usuario
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

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-red-200 shadow-2xl mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 placeholder-gray-500"
              />
            </div>
            
            {/* Filtro por rol */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all duration-300 text-gray-800 appearance-none"
              >
                <option value="all">Todos los roles</option>
                <option value="superuser">Super Admin</option>
                <option value="staff">Staff</option>
                <option value="regular">Usuarios regulares</option>
              </select>
            </div>
            
            {/* Estadísticas rápidas */}
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-700">{filteredUsers.length}</div>
                <div className="text-sm text-gray-600">usuarios encontrados</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lista de usuarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/60 backdrop-blur-xl rounded-3xl border border-red-200 shadow-2xl overflow-hidden"
        >
          {loading ? (
            <div className="p-12 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600">Cargando usuarios...</p>
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
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Usuario</th>
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Email</th>
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Rol</th>
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Estado</th>
                    <th className="py-4 px-6 text-left text-red-800 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                        className="border-b border-red-100 hover:bg-red-50/50 transition-all duration-300"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold mr-3"
                            >
                              {user.first_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                            </motion.div>
                            <div>
                              <div className="font-semibold text-gray-800">
                                {user.first_name} {user.last_name}
                              </div>
                              <div className="text-sm text-gray-600">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-gray-700">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {getRoleBadge(user)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {getStatusIcon(user)}
                            <span className="ml-2 text-sm text-gray-600">
                              {user.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
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
        {filteredUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex items-center justify-between bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-red-200 shadow-2xl"
          >
            <div className="text-gray-600">
              Mostrando {filteredUsers.length} de {users.length} usuarios
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
      </div>
    </div>
  );
};

export default AdminUsersList;
