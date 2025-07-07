import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const CreateCustomerForm = () => {
  const [formData, setFormData] = useState({
    address: '',
    address_city: '',
    country_code: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    metadata: {}
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasExistingCustomer, setHasExistingCustomer] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const checkExistingCustomer = async () => {
      try {
        const response = await api.get('/api/customers');
        if (response.data && !response.data.error) {
          setHasExistingCustomer(true);
          setSuccess('Ya tienes un perfil de cliente creado.');
        }
      } catch (error) {
        if (error.response && error.response.status !== 404) {
          setError('Error al verificar el perfil de cliente existente.');
        }
      }
    };

    checkExistingCustomer();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!user) {
        throw new Error('No se encontró el usuario autenticado.');
      }

      const response = await api.post('/api/customers/', formData);

      console.log('Customer created:', response.data);
      setSuccess('Perfil de cliente creado exitosamente.');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error creating customer:', error);
      if (error.response) {
        setError(error.response.data.error || 'Ocurrió un error al crear el perfil de cliente.');
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.');
      } else {
        setError(error.message || 'Ocurrió un error inesperado.');
      }

      if (error.response && error.response.status === 401) {
        logout();
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-red-200/50">
          <p className="text-gray-700">Por favor, inicia sesión para crear tu perfil de cliente.</p>
        </div>
      </div>
    );
  }

  if (hasExistingCustomer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden p-8 max-w-md w-full border border-red-200/50"
        >
          <div className="flex items-center justify-center text-green-500 mb-4">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <CheckCircle size={48} />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Perfil de Cliente Existente</h2>
          <p className="text-center text-gray-600 mb-6">{success}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out shadow-lg"
          >
            Ir al Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-red-200/50"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="mr-3 p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg"
            >
              <User size={28} className="text-white" />
            </motion.div>
            Crear Perfil de Cliente
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nombre"
                name="first_name"
                type="text"
                placeholder="Juan"
                value={formData.first_name}
                onChange={handleChange}
                required
                icon={<User className="text-red-400" size={18} />}
              />
              <InputField
                label="Apellido"
                name="last_name"
                type="text"
                placeholder="Pérez"
                value={formData.last_name}
                onChange={handleChange}
                required
                icon={<User className="text-red-400" size={18} />}
              />
              <InputField
                label="Correo Electrónico"
                name="email"
                type="email"
                placeholder="juan.perez@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
                required
                icon={<Mail className="text-red-400" size={18} />}
              />
              <InputField
                label="Número de Teléfono"
                name="phone_number"
                type="tel"
                placeholder="+51123456789"
                value={formData.phone_number}
                onChange={handleChange}
                required
                icon={<Phone className="text-red-400" size={18} />}
              />
              <InputField
                label="Dirección"
                name="address"
                type="text"
                placeholder="Av. Principal 123"
                value={formData.address}
                onChange={handleChange}
                required
                icon={<MapPin className="text-red-400" size={18} />}
              />
              <InputField
                label="Ciudad"
                name="address_city"
                type="text"
                placeholder="Lima"
                value={formData.address_city}
                onChange={handleChange}
                required
                icon={<MapPin className="text-red-400" size={18} />}
              />
              <InputField
                label="Código de País"
                name="country_code"
                type="text"
                placeholder="PE"
                value={formData.country_code}
                onChange={handleChange}
                required
                maxLength={2}
                icon={<Globe className="text-red-400" size={18} />}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
              >
                <AlertCircle size={18} className="mr-2" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-green-600 text-sm bg-green-50 p-3 rounded-xl border border-green-200"
              >
                <CheckCircle size={18} className="mr-2" />
                {success}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out flex items-center justify-center shadow-lg hover:shadow-xl"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <User className="mr-2" size={20} />
              )}
              {isLoading ? 'Creando...' : 'Crear Perfil de Cliente'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, name, type, placeholder, value, onChange, required, maxLength, icon }) => (
  <div>
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        className={`shadow appearance-none border border-red-200 rounded-xl w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 ease-in-out bg-white/50 backdrop-blur-sm ${icon ? 'pl-10' : ''}`}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
      />
    </div>
  </div>
);

export default CreateCustomerForm;

