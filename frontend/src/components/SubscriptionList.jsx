import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchSubscriptions = async () => {
    try {
      if (!user?.token) {
        setError('No hay token de autenticación');
        return;
      }

      const response = await api.get('/api/subscriptions/');

      console.log('Subscriptions response:', response.data);
      
      if (response.data && response.data.data) {
        setSubscriptions(response.data.data);
      } else {
        setSubscriptions([]);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err.response?.data?.error || 'Error al cargar suscripciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchSubscriptions();
    }
  }, [user]);

  const cancelSubscription = async (subscriptionId) => {
    if (!window.confirm('¿Estás seguro de cancelar esta suscripción?')) {
      return;
    }

    try {
      const response = await api.delete(`/api/subscriptions/${subscriptionId}/`);
      
      if (response.status === 204) {
        setSubscriptions(prevSubs => 
          prevSubs.filter(sub => sub.id !== subscriptionId)
        );
        // Mostrar mensaje de éxito
        setSuccess('Suscripción cancelada exitosamente');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cancelar la suscripción');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!subscriptions.length) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No hay suscripciones activas
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Mis Suscripciones</h2>
      <div className="grid gap-6">
        {subscriptions.map(subscription => (
          <div key={subscription?.id} className="border rounded-lg p-6 bg-white shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  ID: {subscription?.id}
                </h3>
                <p className="text-gray-600 mb-2">
                  Estado: {subscription?.status === 1 ? 'Activo' : 'Inactivo'}
                </p>
                {subscription?.next_billing_date && (
                  <p className="text-gray-600 mb-2">
                    Próximo cobro: {new Date(subscription.next_billing_date * 1000).toLocaleDateString()}
                  </p>
                )}
                {subscription?.plan && (
                  <>
                    <p className="text-gray-600 mb-2">
                      Plan: {subscription.plan.name}
                    </p>
                    <p className="text-gray-600">
                      Monto: S/ {(subscription.plan.amount || 0) / 100}
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={() => subscription?.id && cancelSubscription(subscription.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionList;