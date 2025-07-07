import React, { useState } from 'react';
import api from '../api';

const estados = [
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'atendido', label: 'Atendido' },
  { value: 'cerrado', label: 'Cerrado' },
];

const AdminReclamoResponder = ({ reclamo, onResponded }) => {
  const [respuesta, setRespuesta] = useState(reclamo.respuesta || '');
  const [estado, setEstado] = useState(reclamo.estado);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.patch(`/api/admin/reclamos/${reclamo.id}/responder/`, { respuesta, estado });
      setSuccess('Respuesta guardada');
      if (onResponded) onResponded(res.data);
    } catch {
      setError('No se pudo guardar la respuesta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-2">
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Respuesta</label>
        <textarea className="w-full border rounded-lg p-2 min-h-[60px]" value={respuesta} onChange={e => setRespuesta(e.target.value)} />
      </div>
      <div>
        <label className="block text-gray-700 font-semibold mb-1">Estado</label>
        <select className="w-full border rounded-lg p-2" value={estado} onChange={e => setEstado(e.target.value)}>
          {estados.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all">
        {loading ? 'Guardando...' : 'Guardar Respuesta'}
      </button>
    </form>
  );
};

export default AdminReclamoResponder;
