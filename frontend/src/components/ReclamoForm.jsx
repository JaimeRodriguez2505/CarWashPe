import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, User, Mail, Phone, Send, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api';

const ReclamoForm = () => {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/api/reclamos/', form);
      setSuccess('¡Tu reclamo ha sido enviado exitosamente!');
      setForm({ nombre: '', email: '', telefono: '', mensaje: '' });
    } catch (err) {
      setError('No se pudo enviar el reclamo. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-red-200/50"
      >
        <div className="text-center mb-8">
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
              <MessageSquare size={28} className="text-white" />
            </motion.div>
            Libro de Reclamaciones
          </motion.h2>
          <p className="text-gray-600">Tu opinión es importante para nosotros</p>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-green-600 text-sm bg-green-50 p-3 rounded-xl border border-green-200 mb-6"
          >
            <CheckCircle size={18} className="mr-2" />
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200 mb-6"
          >
            <AlertCircle size={18} className="mr-2" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Nombre"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            required
            icon={<User className="text-red-400" size={18} />}
            placeholder="Tu nombre completo"
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            icon={<Mail className="text-red-400" size={18} />}
            placeholder="tu@email.com"
          />

          <InputField
            label="Teléfono"
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            icon={<Phone className="text-red-400" size={18} />}
            placeholder="+51 123 456 789"
          />

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              <MessageSquare className="inline mr-2 text-red-400" size={18} />
              Mensaje
            </label>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              className="w-full border border-red-200 rounded-xl p-3 min-h-[120px] focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white/50 backdrop-blur-sm transition-all duration-300 resize-none"
              placeholder="Describe tu reclamo o sugerencia..."
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2" size={18} />
                Enviar Reclamo
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

const InputField = ({ label, name, type, value, onChange, required, icon, placeholder }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-2" htmlFor={name}>
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`w-full border border-red-200 rounded-xl p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white/50 backdrop-blur-sm transition-all duration-300 ${icon ? 'pl-10' : ''}`}
      />
    </div>
  </div>
);

export default ReclamoForm;
