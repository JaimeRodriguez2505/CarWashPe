import React, { useEffect, useState } from 'react';
import { Users, Briefcase, AlertCircle, UserPlus, MessageCircle } from 'lucide-react';
import api from '../api';

const Card = ({ icon, value, label, color }) => (
  <div className={`flex flex-col items-center justify-center rounded-2xl shadow-lg p-6 bg-white border-t-4 ${color} transition-all hover:scale-105`}>
    <div className="mb-2">{icon}</div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-gray-600 mt-1 text-lg">{label}</div>
  </div>
);

const AdminDashboardMetrics = () => {
  const [metrics, setMetrics] = useState({ clientes: 0, reclamos: 0, empresas: 0 });
  const [ultimosUsuarios, setUltimosUsuarios] = useState([]);
  const [ultimosReclamos, setUltimosReclamos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [usersRes, reclamosRes, empresasRes] = await Promise.all([
          api.get('/api/admin/users/'),
          api.get('/api/admin/reclamos/'),
          api.get('/api/empresas/'),
        ]);
        setMetrics({
          clientes: usersRes.data.length,
          reclamos: reclamosRes.data.length,
          empresas: empresasRes.data.length,
        });
        setUltimosUsuarios(usersRes.data.slice(-5).reverse());
        setUltimosReclamos(reclamosRes.data.slice(0, 5));
      } catch {
        // ...
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <Card icon={<Users size={40} className="text-indigo-600" />} value={loading ? '...' : metrics.clientes} label="Clientes Totales" color="border-indigo-500" />
        <Card icon={<Briefcase size={40} className="text-blue-600" />} value={loading ? '...' : metrics.empresas} label="Empresas Registradas" color="border-blue-500" />
        <Card icon={<AlertCircle size={40} className="text-yellow-600" />} value={loading ? '...' : metrics.reclamos} label="Reclamos Totales" color="border-yellow-500" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <UserPlus className="text-indigo-500 mr-2" />
            <h3 className="text-lg font-bold text-indigo-700">Últimos Usuarios</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {ultimosUsuarios.length === 0 ? <li className="text-gray-400">Sin usuarios recientes</li> : ultimosUsuarios.map(u => (
              <li key={u.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="font-semibold text-gray-700">{u.first_name} {u.last_name || u.username}</span>
                <span className="text-gray-500 text-sm">{u.email}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <MessageCircle className="text-yellow-500 mr-2" />
            <h3 className="text-lg font-bold text-yellow-700">Últimos Reclamos</h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {ultimosReclamos.length === 0 ? <li className="text-gray-400">Sin reclamos recientes</li> : ultimosReclamos.map(r => (
              <li key={r.id} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="font-semibold text-gray-700">{r.nombre}</span>
                <span className="text-gray-500 text-sm truncate max-w-xs">{r.mensaje.slice(0, 40)}{r.mensaje.length > 40 ? '...' : ''}</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${r.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : r.estado === 'atendido' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardMetrics;
