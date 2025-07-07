import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Save, Loader2, AlertCircle, CheckCircle, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const UpdateCustomerForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    address_city: '',
    country_code: '',
    phone_number: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!user?.token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await api.patch('/api/customers/edit/', formData);
      setSuccess('Información actualizada correctamente.');
      // Redirigir de nuevo a la pantalla de información del cliente luego de un breve delay.
      setTimeout(() => {
        navigate('/profile'); // O la ruta donde muestras la info del customer
      }, 1500);
    } catch (err) {
      console.error('Error al actualizar datos del cliente:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Ocurrió un error al actualizar los datos del cliente');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full space-y-6 border border-red-200/50"
      >
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center"
          >
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
            Actualizar Información
          </motion.h2>
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200"
          >
            <AlertCircle size={16} className="mr-2" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-green-600 text-sm bg-green-50 p-3 rounded-xl border border-green-200"
          >
            <CheckCircle size={16} className="mr-2" />
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nombre"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            icon={<User className="text-red-400" size={18} />}
          />

          <InputField
            label="Apellido"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            icon={<User className="text-red-400" size={18} />}
          />

          <InputField
            label="Dirección"
            name="address"
            value={formData.address}
            onChange={handleChange}
            icon={<MapPin className="text-red-400" size={18} />}
          />

          <InputField
            label="Ciudad"
            name="address_city"
            value={formData.address_city}
            onChange={handleChange}
            icon={<MapPin className="text-red-400" size={18} />}
          />

          <InputField
            label="Código de País"
            name="country_code"
            value={formData.country_code}
            onChange={handleChange}
            icon={<Globe className="text-red-400" size={18} />}
          />

          <InputField
            label="Teléfono"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            icon={<Phone className="text-red-400" size={18} />}
          />

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2" size={20} />
                Guardar Cambios
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input 
        type="text" 
        name={name} 
        value={value} 
        onChange={onChange}
        className={`block w-full border border-red-200 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white/50 backdrop-blur-sm transition-all duration-300 ${icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

export default UpdateCustomerForm;

