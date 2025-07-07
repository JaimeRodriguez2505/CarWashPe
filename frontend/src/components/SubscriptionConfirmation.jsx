import React from 'react';
import { Link } from 'react-router-dom';

export default function SubscriptionConfirmation() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">¡Suscripción Exitosa!</h1>
      <p className="mb-4">Gracias por suscribirte. Tu pago ha sido procesado correctamente.</p>
      <p className="mb-8">Recibirás un correo electrónico con los detalles de tu suscripción.</p>
      <Link to="/dashboard" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
        Ir al Dashboard
      </Link>
    </div>
  );
}