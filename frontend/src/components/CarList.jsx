import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Car, Plus, Edit, Trash2, AlertCircle, Search, Grid, List, Camera, Phone, Palette, Calendar, Clock, Zap, Star, Target, TrendingUp, DollarSign } from 'lucide-react';
import api from '../api';

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const { companyId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get(`/api/carros/?empresa=${companyId}`);
        setCars(response.data);
        setFilteredCars(response.data);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError('No se pudieron cargar los carros. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, [companyId]);

  useEffect(() => {
    let results = cars.filter(car =>
      (car.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
       car.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
       car.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (car.color && car.color.toLowerCase().includes(searchTerm.toLowerCase())) ||
       (car.numero_telefono && car.numero_telefono.includes(searchTerm))) &&
      (filterStatus === 'all' || car.estado === filterStatus)
    );

    // Ordenar resultados
    results = sortCars(results, sortBy, sortOrder);
    
    setFilteredCars(results);
  }, [searchTerm, filterStatus, sortBy, sortOrder, cars]);



  const sortCars = (cars, sortBy, sortOrder) => {
    return [...cars].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.dia_entrada || 0);
          bValue = new Date(b.dia_entrada || 0);
          break;
        case 'price':
          aValue = a.precio || 0;
          bValue = b.precio || 0;
          break;
        case 'marca':
          aValue = a.marca.toLowerCase();
          bValue = b.marca.toLowerCase();
          break;
        case 'estado':
          aValue = a.estado;
          bValue = b.estado;
          break;
        default:
          aValue = new Date(a.dia_entrada || 0);
          bValue = new Date(b.dia_entrada || 0);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const handleDelete = async (carId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este carro?')) {
      try {
        await api.delete(`/api/carros/${carId}/`);
        setCars(prevCars => prevCars.filter(car => car.id !== carId));
      } catch (error) {
        console.error("Error deleting car:", error);
        setError('No se pudo eliminar el carro. Por favor, inténtalo de nuevo.');
      }
    }
  };

  const handleStateChange = async (carId, newState) => {
    try {
      const updateData = { estado: newState };
      if (newState === 'terminado') {
        updateData.dia_salida = new Date().toISOString().split('T')[0];
      }
      await api.patch(`/api/carros/${carId}/`, updateData);
      setCars(prevCars => prevCars.map(car => 
        car.id === carId ? { ...car, ...updateData } : car
      ));
    } catch (error) {
      console.error("Error updating car state:", error);
      setError('No se pudo actualizar el estado del carro. Por favor, inténtalo de nuevo.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'espera': return 'from-amber-500 to-orange-600';
      case 'proceso': return 'from-blue-500 to-cyan-600';
      case 'terminado': return 'from-emerald-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch(status) {
      case 'espera': return 'bg-amber-500/10 border-amber-500/20';
      case 'proceso': return 'bg-blue-500/10 border-blue-500/20';
      case 'terminado': return 'bg-emerald-500/10 border-emerald-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(amount);
  };



  // Componente de partículas flotantes
  const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );

  // Componente de tarjeta con efectos avanzados
  const CarCard = ({ car, index }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
    const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
    const scale = useSpring(1, { stiffness: 300, damping: 30 });

    const handleMouseMove = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(event.clientX - centerX);
      mouseY.set(event.clientY - centerY);
    };

    const handleMouseEnter = () => {
      scale.set(1.05);
    };

    const handleMouseLeave = () => {
      scale.set(1);
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 50, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.8 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={{ scale: 1.02 }}
        className="relative group"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Efecto de brillo en hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-600/10 to-red-700/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            rotate: 0,
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          style={{ rotateX, rotateY, scale }}
          className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-red-200/50 hover:border-red-300/70 transition-all duration-500"
        >
          {/* Header con gradiente dinámico */}
          <div className="relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-800 to-red-900"
              animate={{
                background: [
                  "linear-gradient(45deg, #dc2626 0%, #991b1b 100%)",
                  "linear-gradient(45deg, #991b1b 0%, #dc2626 100%)",
                  "linear-gradient(45deg, #7f1d1d 0%, #991b1b 100%)",
                  "linear-gradient(45deg, #dc2626 0%, #991b1b 100%)",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="text-red-300" size={24} />
                  </motion.div>
                  <h3 className="font-bold text-xl">{car.marca} {car.modelo}</h3>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getStatusColor(car.estado)} shadow-lg`}
                >
                  {car.estado === 'espera' ? 'En Espera' : 
                   car.estado === 'proceso' ? 'En Proceso' : 'Terminado'}
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <Target className="text-red-300" size={16} />
                <span className="font-mono text-lg">{car.placa}</span>
              </motion.div>
            </div>
          </div>

          {/* Foto del carro con efectos */}
          <div className="relative h-56 overflow-hidden">
            {car.foto ? (
              <motion.img
                src={car.foto}
                alt={`${car.marca} ${car.modelo}`}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Camera size={48} className="text-red-400" />
                </motion.div>
              </div>
            )}
            
            {/* Overlay con información */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30"
              >
                <div className="grid grid-cols-2 gap-2 text-white text-sm">
                  {car.color && (
                    <div className="flex items-center space-x-2">
                      <Palette size={14} />
                      <span>{car.color}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Phone size={14} />
                    <span>{car.numero_telefono}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Información del carro */}
          <div className="p-6 space-y-4">
            {/* Precio con animación */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-2xl text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Precio</span>
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp size={20} className="text-red-300" />
                </motion.div>
              </div>
              <div className="text-2xl font-bold mt-1">{formatCurrency(car.precio)}</div>
            </motion.div>

            {/* Fecha de entrada */}
            {car.dia_entrada && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Entrada: {formatDate(car.dia_entrada)}</span>
              </div>
            )}

            {/* Botones de estado con efectos */}
            <div className="grid grid-cols-3 gap-3">
              {['espera', 'proceso', 'terminado'].map((estado) => (
                <motion.button
                  key={estado}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStateChange(car.id, estado)}
                  className={`px-3 py-3 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    car.estado === estado
                      ? `bg-gradient-to-r ${getStatusColor(estado)} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {estado === 'espera' ? 'Espera' : 
                   estado === 'proceso' ? 'Proceso' : 'Listo'}
                </motion.button>
              ))}
            </div>

            {/* Acciones */}
            <div className="flex space-x-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/companies/${companyId}/edit-car/${car.id}`)}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <Edit size={16} className="mr-2" />
                Editar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDelete(car.id)}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg"
              >
                <Trash2 size={16} className="mr-2" />
                Borrar
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const CarListItem = ({ car, index }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.02, x: 10 }}
      className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-red-200/50 hover:border-red-300/70 transition-all duration-500"
    >
      <div className="flex items-center space-x-6">
        {/* Foto miniatura con efectos */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg"
        >
          {car.foto ? (
            <img
              src={car.foto}
              alt={`${car.marca} ${car.modelo}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera size={32} className="text-red-400" />
            </div>
          )}
        </motion.div>

        {/* Información principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-800 bg-clip-text text-transparent">
              {car.marca} {car.modelo}
            </h3>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${getStatusColor(car.estado)} text-white shadow-lg`}
            >
              {car.estado === 'espera' ? 'En Espera' : 
               car.estado === 'proceso' ? 'En Proceso' : 'Terminado'}
            </motion.div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Target className="text-red-500" size={16} />
              <span className="font-mono">{car.placa}</span>
            </div>
            {car.color && (
              <div className="flex items-center space-x-2">
                <Palette className="text-red-500" size={16} />
                <span>{car.color}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Phone className="text-red-500" size={16} />
              <span>{car.numero_telefono}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="text-red-500" size={16} />
              <span className="font-semibold">{formatCurrency(car.precio)}</span>
            </div>
          </div>
          {car.dia_entrada && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
              <Calendar className="text-red-500" size={14} />
              <span>Entrada: {formatDate(car.dia_entrada)}</span>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/companies/${companyId}/edit-car/${car.id}`)}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-3 rounded-xl transition-all duration-300 shadow-lg"
          >
            <Edit size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(car.id)}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white p-3 rounded-xl transition-all duration-300 shadow-lg"
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 relative overflow-hidden">
      <FloatingParticles />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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
                <Car size={36} className="text-white" />
              </motion.div>
              Gestión de Carros
            </motion.h1>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-center border border-red-200"
            >
              <AlertCircle className="inline mr-2" size={20} />
              {error}
            </motion.div>
          )}

          {/* Botón principal - Agregar Nuevo Carro */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="mb-8"
          >
            <Link
              to={`/companies/${companyId}/add-car`}
              className="block w-full text-center bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-700 hover:via-red-800 hover:to-red-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-500 flex items-center justify-center text-xl shadow-2xl relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <Plus size={28} className="mr-4 group-hover:rotate-90 transition-transform duration-300" />
              Agregar Nuevo Carro
            </Link>
          </motion.div>

          {/* Controles simplificados */}
          <div className="mb-8 space-y-4">
            {/* Búsqueda */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por marca, modelo, placa, color o teléfono..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-red-500/30 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 bg-white/80 backdrop-blur-xl text-gray-800 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
            
            {/* Controles rápidos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 items-center justify-between"
            >
              {/* Selector de vista */}
              <div className="flex bg-white/80 backdrop-blur-xl rounded-2xl p-2 border border-red-200/50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <Grid size={18} className="mr-2" />
                  Mosaico
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                >
                  <List size={18} className="mr-2" />
                  Lista
                </button>
              </div>

              {/* Filtro rápido por estado */}
              <div className="flex space-x-2">
                {['all', 'espera', 'proceso', 'terminado'].map((status) => (
                  <motion.button
                    key={status}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      filterStatus === status
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                        : 'bg-white/80 text-gray-600 hover:bg-white border border-red-200/50'
                    }`}
                  >
                    {status === 'all' ? 'Todos' : 
                     status === 'espera' ? 'En Espera' : 
                     status === 'proceso' ? 'En Proceso' : 'Terminado'}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <>
              {filteredCars.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Car size={80} className="mx-auto text-red-400 mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">No hay carros registrados</h3>
                  <p className="text-gray-600 mb-8">Comienza agregando tu primer carro para el lavado</p>
                  <Link
                    to={`/companies/${companyId}/add-car`}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-2xl"
                  >
                    <Plus size={24} className="mr-3" />
                    Agregar Primer Carro
                  </Link>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredCars.map((car, index) => (
                        <CarCard key={car.id} car={car} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredCars.map((car, index) => (
                        <CarListItem key={car.id} car={car} index={index} />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CarList;

