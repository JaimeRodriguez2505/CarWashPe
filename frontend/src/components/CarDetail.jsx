import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, ArrowLeft, Calendar, Phone, Palette, DollarSign, MapPin, Camera } from 'lucide-react';
import api from '../api';

const CarDetail = () => {
  const { carId, companyId } = useParams();
  const [car, setCar] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetails = async () => {   
      try {
        const response = await api.get(`/api/carros/${carId}/`);
        setCar(response.data);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setError('Failed to fetch car details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [carId]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'espera': return 'bg-yellow-200 text-yellow-800';
      case 'proceso': return 'bg-blue-200 text-blue-800';
      case 'terminado': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificado';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <Link 
            to={`/companies/${companyId}/cars`}
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 text-center">
          <p className="text-gray-500 text-lg">Carro no encontrado</p>
          <Link 
            to={`/companies/${companyId}/cars`}
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={20} className="mr-2" />
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <Car className="mr-3" size={32} />
              Detalles del Carro
            </h2>
            <Link
              to={`/companies/${companyId}/cars`}
              className="text-indigo-600 hover:text-indigo-800 transition duration-200 flex items-center bg-indigo-100 px-4 py-2 rounded-lg"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver a la lista
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Foto del carro */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center"
            >
              {car.foto ? (
                <img
                  src={car.foto}
                  alt={`${car.marca} ${car.modelo}`}
                  className="max-w-full h-auto rounded-lg shadow-md object-cover max-h-80"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <Camera size={64} className="mx-auto mb-4" />
                  <p className="text-lg">Sin foto disponible</p>
                </div>
              )}
            </motion.div>

            {/* Información del carro */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl">
                <h3 className="text-2xl font-bold mb-2">{car.marca} {car.modelo}</h3>
                <p className="text-lg opacity-90">Placa: {car.placa}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard 
                  icon={<Palette size={20} />}
                  label="Color"
                  value={car.color || 'No especificado'}
                />
                <InfoCard 
                  icon={<Phone size={20} />}
                  label="Teléfono"
                  value={car.numero_telefono}
                />
                <InfoCard 
                  icon={<DollarSign size={20} />}
                  label="Precio"
                  value={`$${typeof car.precio === 'number' ? car.precio.toFixed(2) : car.precio}`}
                />
                <InfoCard 
                  icon={<span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(car.estado)}`}>●</span>}
                  label="Estado"
                  value={car.estado.charAt(0).toUpperCase() + car.estado.slice(1)}
                />
              </div>

              <div className="space-y-4">
                <InfoCard 
                  icon={<Calendar size={20} />}
                  label="Fecha de Llegada"
                  value={formatDate(car.dia_llegada)}
                  fullWidth
                />
                {car.dia_salida && (
                  <InfoCard 
                    icon={<Calendar size={20} />}
                    label="Fecha de Salida"
                    value={formatDate(car.dia_salida)}
                    fullWidth
                  />
                )}
              </div>
            </motion.div>
          </div>

          {/* Acciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <Link
              to={`/companies/${companyId}/edit-car/${car.id}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 flex items-center"
            >
              Editar Carro
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const InfoCard = ({ icon, label, value, fullWidth = false }) => (
  <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${fullWidth ? 'col-span-full' : ''}`}>
    <div className="flex items-center space-x-3">
      <div className="text-indigo-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

export default CarDetail;
