"use client";
import { useState, useMemo } from "react";
import { saveSalaAction, deleteSalaAction } from "@/actions/salasActions";

export default function SalasClient({ datosIniciales, permisos }: any) {
  const [salas, setSalas] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState({ id: 0, nombre: "", capacidadAsientos: 50, esVIP: false });
  const [procesando, setProcesando] = useState(false);

  const filtradas = useMemo(() => {
    return salas.filter((s: any) => 
      s.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, salas]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / registrosPorPagina));
  const paginadas = filtradas.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina);

  const handleSave = async () => {
    setProcesando(true);
    const res = await saveSalaAction(editando);
    if (res.success) location.reload();
    else alert(res.error);
    setProcesando(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Deseas eliminar esta sala del complejo?")) {
      const res = await deleteSalaAction(id);
      if (res.success) location.reload();
      else alert(res.error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-3xl font-bold text-slate-800">💺 Gestión de Salas</h2>
        {permisos.bitAgregar && (
          <button onClick={() => { setEditando({ id: 0, nombre: "", capacidadAsientos: 50, esVIP: false }); setModalOpen(true); }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full shadow transition-colors">
            + Nueva Sala
          </button>
        )}
      </div>

      <input 
        type="text" placeholder="Buscar sala..." 
        className="w-full md:w-1/2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none mb-4"
        value={busqueda}
        onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4">Nombre de la Sala</th>
              <th className="p-4 text-center">Capacidad</th>
              <th className="p-4 text-center">Formato</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginadas.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-slate-500">No hay salas registradas.</td></tr>
            ) : (
              paginadas.map((s: any) => (
                <tr key={s.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{s.nombre}</td>
                  <td className="p-4 text-center">{s.capacidadAsientos} pax</td>
                  <td className="p-4 text-center">
                    {s.esVIP ? 
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">🌟 VIP</span> : 
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Estándar</span>
                    }
                  </td>
                  <td className="p-4 text-center space-x-2">
                    {permisos.bitEditar && (
                      <button onClick={() => { setEditando(s); setModalOpen(true); }}
                              className="text-blue-600 hover:text-blue-800 font-bold px-2 py-1 bg-blue-50 rounded">Editar</button>
                    )}
                    {permisos.bitEliminar && (
                      <button onClick={() => handleDelete(s.id)}
                              className="text-red-600 hover:text-red-800 font-bold px-2 py-1 bg-red-50 rounded">Eliminar</button>
                    )}
                    {!permisos.bitEditar && !permisos.bitEliminar && (
                      <span className="text-slate-400 text-xs italic">Solo Lectura</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editando.id === 0 ? "Nueva Sala" : "Editar Sala"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Nombre de la Sala</label>
                <input value={editando.nombre} onChange={e => setEditando({...editando, nombre: e.target.value})} className="w-full p-2 border rounded" placeholder="Ej: Sala 1 3D" autoFocus />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Capacidad (Asientos)</label>
                <input type="number" value={editando.capacidadAsientos} onChange={e => setEditando({...editando, capacidadAsientos: Number(e.target.value)})} className="w-full p-2 border rounded" />
              </div>
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-50 rounded-lg border">
                <input type="checkbox" checked={editando.esVIP} onChange={e => setEditando({...editando, esVIP: e.target.checked})} className="w-5 h-5 accent-emerald-600" />
                <span className="text-sm font-bold text-slate-700">¿Es sala formato VIP?</span>
              </label>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancelar</button>
                <button onClick={handleSave} disabled={procesando} className="px-6 py-2 bg-emerald-600 text-white font-bold rounded shadow hover:bg-emerald-700 disabled:opacity-50">
                  {procesando ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}