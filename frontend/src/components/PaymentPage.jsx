import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function PaymentPage() {
  const location = useLocation();
  const { plan } = location.state; // Obteniendo el plan seleccionado
  const [customerId, setCustomerId] = useState(''); // Asignar el customer_id adecuado
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Verificamos si Culqi.js está cargado correctamente
    if (typeof window.Culqi === 'undefined') {
      setError('Culqi no está cargado correctamente. Por favor, verifica la integración.');
    }
  }, []);

  const handlePayment = () => {
    // Verificamos nuevamente si Culqi está disponible antes de intentar configurarlo
    if (typeof window.Culqi === 'undefined') {
      setError('Culqi no está cargado correctamente. Por favor, verifica la integración.');
      return;
    }

    // Configurar Culqi con la llave pública y la configuración
    try {
      window.Culqi.publicKey = 'pk_test_d65c942d87301cc5'; // Reemplaza con tu llave pública real

      window.Culqi.settings = {
        title: 'Nombre de tu tienda',
        currency: 'PEN',
        description: plan.name,
        amount: plan.amount, // El monto debe estar en céntimos
      };

      // Definimos la función de callback que se ejecutará cuando Culqi genere el token
      window.culqi = async function () {
        if (window.Culqi.token) {
          const token = window.Culqi.token.id;

          try {
            const response = await api.post('/api/create-customer-subscription/', {
              plan_id: plan.id,
              card_token: token,
            });

            if (response.status === 201) {
              alert('Suscripción creada con éxito.');
            } else {
              setError('Error al crear la suscripción. Por favor, inténtalo de nuevo.');
            }
          } catch (error) {
            console.error('Error creando la suscripción:', error);
            setError(error.response?.data?.error || 'Error al crear la suscripción. Por favor, inténtalo de nuevo.');
          }
        } else {
          console.error('Error de Culqi:', window.Culqi.error);
          setError('Error al generar el token de tarjeta. Por favor, inténtalo de nuevo.');
        }
      };

      // Abrir el formulario de Culqi
      window.Culqi.open();
    } catch (err) {
      console.error('Error al configurar o abrir Culqi:', err);
      setError('Error al abrir Culqi. Por favor, revisa la configuración.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Proceso de Pago</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        <p className="text-lg font-bold mb-2">
          {(plan.amount / 100).toFixed(2)} {plan.currency}
        </p>
        <button
          onClick={handlePayment}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Confirmar Pago'}
        </button>
      </div>
    </div>
  );
}
