import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, AlertCircle, Star, Zap, Shield, Clock, DollarSign, User, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasCustomerInfo, setHasCustomerInfo] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchCards = async () => {
    if (!user?.token) {
      console.error("No hay token de autenticación");
      return;
    }

    try {
      const response = await api.get("/api/cards/");
      console.log("Tarjetas obtenidas:", response.data);
      setCards(response.data || []);
      return response;
    } catch (err) {
      console.error("Error al obtener tarjetas:", err);
      setCards([]);
    }
  };

  const checkCustomerInfo = async () => {
    if (!user?.token) return;

    try {
      const response = await api.get('/api/customers');
      if (response.data && !response.data.error) {
        setHasCustomerInfo(true);
      } else {
        setHasCustomerInfo(false);
      }
    } catch (err) {
      console.error("Error al verificar información del cliente:", err);
      setHasCustomerInfo(false);
    }
  };

  const fetchPlans = async () => {
    if (!user?.token) return;

    try {
      const response = await api.get("/api/culqi/plans/");
      console.log("Planes obtenidos:", response.data);
      // Extraer el array de planes de la respuesta
      setPlans(response.data.plans || []);
      return response;
    } catch (err) {
      console.error("Error al obtener planes:", err);
      setError("Error al cargar los planes");
      setPlans([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchPlans(), fetchCards(), checkCustomerInfo()]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.token) {
      loadData();
    }
  }, [navigate, user]);

  const handleSubscribe = async (planId) => {
    try {
      if (!selectedCard) {
        setError('Por favor selecciona una tarjeta');
        return;
      }

      const response = await api.post('/api/subscriptions/', {
        card_id: selectedCard,
        plan_id: planId,
        tyc: true
      });

      if (response.status === 201) {
        setSuccess('¡Suscripción creada exitosamente!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la suscripción');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-red-200/50 max-w-md w-full"
        >
          <div className="flex items-center text-red-600 mb-4">
            <AlertCircle size={24} className="mr-2" />
            <span className="font-semibold">Error</span>
          </div>
          <p className="text-gray-700">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-red-200/50 max-w-md w-full"
        >
          <div className="flex items-center text-yellow-600 mb-4">
            <AlertCircle size={24} className="mr-2" />
            <span className="font-semibold">Sin Planes</span>
          </div>
          <p className="text-gray-700">No hay planes disponibles en este momento.</p>
        </motion.div>
      </div>
    );
  }

  // Verificar si el usuario tiene información completa y tarjetas
  const hasCompleteSetup = hasCustomerInfo && cards.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
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
              <CreditCard size={36} className="text-white" />
            </motion.div>
            Planes Disponibles
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg"
          >
            Elige el plan que mejor se adapte a tus necesidades
          </motion.p>
        </div>

        {/* Aviso importante si no tiene configuración completa */}
        {!hasCompleteSetup && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-2xl border-2 border-red-200 shadow-lg"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-2 bg-red-600 rounded-lg"
                >
                  <Info className="text-white" size={24} />
                </motion.div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-red-800 mb-2">
                  ⚠️ Configuración Requerida
                </h3>
                <p className="text-red-700 mb-4">
                  Para poder suscribirte a un plan, es necesario completar los siguientes pasos:
                </p>
                <div className="space-y-3">
                  {!hasCustomerInfo && (
                    <div className="flex items-center text-red-700">
                      <User className="mr-2" size={18} />
                      <span>Completar tu información de usuario</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/createCustomerForm')}
                        className="ml-auto bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                      >
                        Completar
                      </motion.button>
                    </div>
                  )}
                  {cards.length === 0 && (
                    <div className="flex items-center text-red-700">
                      <CreditCard className="mr-2" size={18} />
                      <span>Agregar una tarjeta de crédito/débito</span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/card')}
                        className="ml-auto bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                      >
                        Agregar
                      </motion.button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-red-600 mt-3">
                  Una vez completados estos pasos, podrás suscribirte a cualquiera de nuestros planes.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-center border border-green-200"
          >
            <CheckCircle className="inline mr-2" size={20} />
            {success}
          </motion.div>
        )}

        {/* Selector de tarjetas - solo mostrar si tiene tarjetas */}
        {cards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-red-200/50"
          >
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <CreditCard className="inline mr-2" size={18} />
              Selecciona una tarjeta
            </label>
            <select
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              className="w-full p-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white/50 backdrop-blur-sm transition-all duration-300"
            >
              <option value="">Selecciona una tarjeta</option>
              {cards.map(card => (
                <option key={card.card_id} value={card.card_id}>
                  **** **** **** {card.last_four}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {/* Lista de planes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(plans) && plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-red-200/50 hover:shadow-2xl transition-all duration-300"
            >
              {/* Header del plan */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-lg mb-4">
                  <Star className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              {/* Precio */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-red-600 mb-1">
                  S/ {(plan.amount / 100).toFixed(2)}
                </div>
                <div className="text-gray-500">por mes</div>
              </div>

              {/* Características del plan */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  Acceso completo al sistema
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="text-blue-500 mr-2" size={16} />
                  Seguridad garantizada
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Zap className="text-yellow-500 mr-2" size={16} />
                  Actualizaciones automáticas
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="text-purple-500 mr-2" size={16} />
                  Soporte 24/7
                </div>
              </div>

              {/* Botón de suscripción */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubscribe(plan.id)}
                disabled={!hasCompleteSetup || !selectedCard}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  !hasCompleteSetup || !selectedCard
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                <DollarSign className="mr-2" size={18} />
                {!hasCompleteSetup 
                  ? 'Configuración requerida' 
                  : !selectedCard 
                    ? 'Selecciona una tarjeta' 
                    : 'Suscribirse'
                }
              </motion.button>
            </motion.div>
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center"
          >
            <AlertCircle className="inline mr-2" size={20} />
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PlanList;