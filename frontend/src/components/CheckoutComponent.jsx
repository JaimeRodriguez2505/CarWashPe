import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';

const publicKey = "pk_test_d65c942d87301cc5";
const mountAmount = 0;

function CheckoutComponent() {
  const [customerId, setCustomerId] = useState(null);
  const [generatedToken, setGeneratedToken] = useState(null); 
  const [isCreatingCard, setIsCreatingCard] = useState(false); 
  const [cards, setCards] = useState([]);
  const [updatingCardId, setUpdatingCardId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCustomerId();
      fetchCards();
    }
  }, [user]);

  useEffect(() => {
    if (customerId && generatedToken && !updatingCardId) {
      createCard(generatedToken);
    }
    if (customerId && generatedToken && updatingCardId) {
      updateCardInBackend(updatingCardId, generatedToken);
    }
  }, [customerId, generatedToken, updatingCardId]);

  const fetchCustomerId = async () => {
    if (!user) {
      console.error("No hay usuario autenticado.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/customers/me/", {
        headers: {
          'Authorization': `Token ${user.token}`
        },
      });
      const cid = response.data.customer_id;
      console.log("Customer ID obtenido:", cid);
      setCustomerId(cid);
      loadCulqiScript();
    } catch (err) {
      console.error("Error al obtener customer_id", err);
      setError("Error al obtener información del cliente");
    }
  };

  const fetchCards = async () => {
    if (!user) return;
    try {
      const response = await axios.get("http://localhost:8000/api/cards/", {
        headers: {
          'Authorization': `Token ${user.token}`
        }
      });
      setCards(response.data);
    } catch (err) {
      console.error("Error al listar tarjetas", err);
      setError("Error al cargar las tarjetas");
    }
  };

  const loadCulqiScript = () => {
    if (!window.CulqiCheckout) {
      const script = document.createElement("script");
      script.src = "https://checkout.culqi.com/js/v4";
      script.onload = initCulqi;
      document.body.appendChild(script);
    } else {
      initCulqi();
    }
  };

  const initCulqi = () => {
    if (!window.CulqiCheckout) return;

    const paymentMethods = {
      tarjeta: true,
      yape: false,
      billetera: false,
      bancaMovil: false,
      agente: false,
      cuotealo: false,
    };

    const options = {
      lang: "auto",
      installments: false,
      modal: true,
      container: "#culqi-container",
      paymentMethods: paymentMethods,
      paymentMethodsSort: ["tarjeta"],
    };

    const settings = {
      title: "CarWash Pe",
      currency: "PEN",
      amount: mountAmount,
    };

    const client = {
      email: "test2@demo.com",
    };

    const appearance = {
      theme: "default",
      hiddenCulqiLogo: false,
      hiddenBannerContent: false,
      hiddenBanner: false,
      hiddenToolBarAmount: false,
      menuType: "sidebar",
      buttonCardPayText: updatingCardId ? "Actualizar Tarjeta" : "Guardar Tarjeta",
      logo: "https://tu-sitio.com/logo.png",
    };

    const config = { settings, client, options, appearance };
    const Culqi = new window.CulqiCheckout(publicKey, config);

    Culqi.culqi = () => {
      if (Culqi.token) {
        const tokenId = Culqi.token.id;
        console.log("Se ha creado un token: ", tokenId);
        Culqi.close();

        setGeneratedToken(tokenId);
        setIsCreatingCard(true);
      } else if (Culqi.order) {
        const order = Culqi.order;
        console.log("Se ha creado el objeto Order: ", order);
      } else {
        console.log("Error: ", Culqi.error);
        setError("Error al procesar la tarjeta");
      }
    };

    window.MyCulqi = Culqi;
  };

  const createCard = async (token_id) => {
    console.log("customerId en createCard:", customerId);
    if (!customerId) {
      console.error("No se encontró el customer_id del usuario.");
      return;
    }

    if (!user) {
      console.error("No hay usuario autenticado, no se puede crear la tarjeta.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/cards/",
        {
          customer_id: customerId,
          token_id: token_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${user.token}`, 
          },
        }
      );

      console.log("Tarjeta creada en backend:", response.data);
      setSuccess("Tarjeta guardada exitosamente.");
      setIsCreatingCard(false);
      setGeneratedToken(null);
      fetchCards();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error al crear la tarjeta en el backend", err);
      setError("Ocurrió un error al guardar la tarjeta.");
      setIsCreatingCard(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  const updateCardInBackend = async (cardId, token_id) => {
    if (!user) return;

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/cards/${cardId}/`,
        {
          token_id: token_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${user.token}`, 
          },
        }
      );

      console.log("Tarjeta actualizada:", response.data);
      setSuccess("Tarjeta actualizada exitosamente.");
      setIsCreatingCard(false);
      setGeneratedToken(null);
      setUpdatingCardId(null);
      fetchCards();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error al actualizar la tarjeta en el backend", err);
      setError("Ocurrió un error al actualizar la tarjeta.");
      setIsCreatingCard(false);
      setTimeout(() => setError(null), 3000);
    }
  };

  const deleteCard = async (cardId) => {
    if (!user) return;

    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarjeta?")) {
      try {
        await axios.delete(`http://localhost:8000/api/cards/${cardId}/`, {
          headers: {
            "Authorization": `Token ${user.token}`
          }
        });
        setSuccess("Tarjeta eliminada exitosamente.");
        fetchCards();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error("Error al eliminar la tarjeta", err);
        setError("Ocurrió un error al eliminar la tarjeta.");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const openCulqi = () => {
    if (window.MyCulqi) {
      window.MyCulqi.open();
    }
  };

  const handleUpdateCard = (cardId) => {
    setUpdatingCardId(cardId);
    openCulqi();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-red-200/50">
          <p className="text-gray-700">Por favor, inicia sesión para gestionar tus tarjetas.</p>
        </div>
      </div>
    );
  }

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
            Gestión de Tarjetas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 text-lg"
          >
            Administra tus métodos de pago de forma segura
          </motion.p>
        </div>

        {/* Mensajes de estado */}
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

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-center border border-green-200"
          >
            <CreditCard className="inline mr-2" size={20} />
            {success}
          </motion.div>
        )}

        {/* Botón agregar tarjeta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCulqi}
            disabled={isCreatingCard}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isCreatingCard ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={20} />
                Creando tarjeta...
              </>
            ) : (
              <>
                <Plus className="mr-2" size={20} />
                Agregar Nueva Tarjeta
              </>
            )}
          </motion.button>
        </motion.div>

        <div id="culqi-container"></div>

        {/* Lista de tarjetas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-red-200/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-red-50 rounded-lg mr-3">
                    <CreditCard className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Tarjeta {card.last_four}</h3>
                    <p className="text-sm text-gray-600 capitalize">{card.brand}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expira:</span>
                  <span className="font-semibold text-gray-800">{card.exp_month}/{card.exp_year}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpdateCard(card.id)}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center"
                >
                  <Edit className="mr-1" size={16} />
                  Actualizar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteCard(card.id)}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center"
                >
                  <Trash2 className="mr-1" size={16} />
                  Eliminar
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {cards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center py-12"
          >
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-red-200/50">
              <CreditCard className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600">No tienes tarjetas guardadas</p>
              <p className="text-sm text-gray-500">Agrega tu primera tarjeta para comenzar</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default CheckoutComponent;
