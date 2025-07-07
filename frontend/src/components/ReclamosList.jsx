import React, { useEffect, useState } from 'react';
import api from '../api';

const estadoColor = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  atendido: 'bg-blue-100 text-blue-800',
  cerrado: 'bg-green-100 text-green-800',
};

const ReclamosList = () => {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReclamos = async () => {
      try {
        const res = await api.get('/api/reclamos/');
        setReclamos(res.data);
      } catch (err) {
        setError('No se pudieron cargar los reclamos.');
      } finally {
        setLoading(false);
      }
    };
    fetchReclamos();
  }, []);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Mis Reclamos</h2>
      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : reclamos.length === 0 ? (
        <div className="text-gray-500">No has enviado reclamos.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800">
                <th className="py-2 px-3 text-left">Fecha</th>
                <th className="py-2 px-3 text-left">Estado</th>
                <th className="py-2 px-3 text-left">Mensaje</th>
                <th className="py-2 px-3 text-left">Respuesta</th>
              </tr>
            </thead>
            <tbody>
              {reclamos.map(r => (
                <tr key={r.id} className="border-b hover:bg-indigo-50 transition">
                  <td className="py-2 px-3">{new Date(r.fecha).toLocaleString()}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColor[r.estado] || 'bg-gray-100 text-gray-800'}`}>
                      {r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-3 max-w-xs truncate" title={r.mensaje}>{r.mensaje}</td>
                  <td className="py-2 px-3 max-w-xs truncate" title={r.respuesta || ''}>{r.respuesta ? r.respuesta : <span className="italic text-gray-400">Sin respuesta</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReclamosList;
