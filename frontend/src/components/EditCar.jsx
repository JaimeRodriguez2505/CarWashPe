import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Save, ArrowLeft, AlertCircle, Camera, Phone, Tag, Calendar, CheckCircle } from 'lucide-react';
import api from '../api';

const MEDIA_URL = import.meta.env.VITE_MEDIA_URL || 'http://localhost:8000/media/';

const EditCar = () => {
  const [car, setCar] = useState({
    placa: '',
    marca: '',
    modelo: '',
    estado: '',
    precio: '',
    color: '',
    numero_telefono: '',
    dia_llegada: '',
    dia_salida: '',
    foto: '',
  });
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { companyId, carId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/carros/${carId}/`);
        setCar(response.data);
        if (response.data.foto) {
          setFotoPreview(response.data.foto.startsWith('http') ? response.data.foto : MEDIA_URL + (response.data.foto.startsWith('/') ? response.data.foto.slice(1) : response.data.foto));
        }
      } catch (error) {
        setError('No se pudo cargar los detalles del carro.');
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCar();
    }
  }, [carId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFotoFile(files[0]);
      setFotoPreview(files[0] ? URL.createObjectURL(files[0]) : null);
    } else {
      setCar(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const data = new FormData();
      Object.entries(car).forEach(([key, value]) => {
        if (key !== 'foto') data.append(key, value);
      });
      data.append('empresa', companyId);
      if (fotoFile) data.append('foto', fotoFile);
      await api.put(`/api/carros/${carId}/`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate(`/companies/${companyId}/cars`);
    } catch (error) {
      setError('No se pudo actualizar el carro. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mr-3 p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg"
              >
                <Car size={28} className="text-white" />
              </motion.div>
              Editar Carro
            </h2>
            <Link
              to={`/companies/${companyId}/cars`}
              className="text-red-600 hover:text-red-800 transition duration-200 flex items-center"
            >
              <ArrowLeft size={20} className="mr-1" />
              Volver
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Placa"
                name="placa"
                type="text"
                value={car.placa}
                onChange={handleChange}
                required
                icon={<Tag className="text-red-400" size={18} />}
              />
              <InputField
                label="Marca"
                name="marca"
                type="text"
                value={car.marca}
                onChange={handleChange}
                required
                icon={<Car className="text-red-400" size={18} />}
              />
              <InputField
                label="Modelo"
                name="modelo"
                type="text"
                value={car.modelo}
                onChange={handleChange}
                icon={<Car className="text-red-400" size={18} />}
              />
              <InputField
                label="Color"
                name="color"
                type="text"
                value={car.color || ''}
                onChange={handleChange}
                icon={<Car className="text-red-400" size={18} />}
              />
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                  <CheckCircle className="inline mr-2 text-red-400" size={18} />
                  Estado
                </label>
                <select
                  className="shadow appearance-none border border-red-200 rounded-xl w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 ease-in-out bg-white/50 backdrop-blur-sm"
                  id="estado"
                  name="estado"
                  value={car.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar estado</option>
                  <option value="espera">En Espera</option>
                  <option value="proceso">En Proceso</option>
                  <option value="terminado">Terminado</option>
                </select>
              </div>
              <InputField
                label="Número de Teléfono"
                name="numero_telefono"
                type="tel"
                value={car.numero_telefono || ''}
                onChange={handleChange}
                required
                icon={<Phone className="text-red-400" size={18} />}
              />
              <InputField
                label="Precio"
                name="precio"
                type="number"
                value={car.precio}
                onChange={handleChange}
                required
                icon={<Tag className="text-red-400" size={18} />}
              />
              <InputField
                label="Día de Llegada"
                name="dia_llegada"
                type="date"
                value={car.dia_llegada || ''}
                onChange={handleChange}
                icon={<Calendar className="text-red-400" size={18} />}
              />
              <InputField
                label="Día de Salida"
                name="dia_salida"
                type="date"
                value={car.dia_salida || ''}
                onChange={handleChange}
                icon={<Calendar className="text-red-400" size={18} />}
              />
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="foto">
                  <Camera className="inline mr-2 text-red-400" size={18} />
                  Foto del Carro
                </label>
                <input
                  className="block w-full text-sm text-gray-700 border border-red-200 rounded-xl cursor-pointer bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  id="foto"
                  name="foto"
                  type="file"
                  accept="image/*"
                  onChange={handleChange}
                />
                {fotoPreview && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={fotoPreview}
                    alt="Vista previa"
                    className="mt-2 rounded-xl shadow-lg max-h-40 object-contain border border-red-200"
                  />
                )}
              </div>
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
            
            <div className="flex items-center justify-between gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 ease-in-out flex items-center justify-center shadow-lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Save size={20} className="mr-2" />
                )}
                {isSubmitting ? 'Actualizando...' : 'Actualizar Carro'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300 ease-in-out shadow-lg"
                type="button"
                onClick={() => navigate(`/companies/${companyId}/cars`)}
              >
                Cancelar
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange, required, icon }) => (
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
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  </div>
);

export default EditCar;

