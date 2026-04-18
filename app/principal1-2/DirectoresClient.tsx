"use client";
import { useState, useMemo } from "react";
import { saveDirectorAction, deleteDirectorAction } from "@/actions/directoresActions";

export default function DirectoresClient({ datosIniciales, permisos }: any) {
  const [directores, setDirectores] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState({ id: 0, nombreCompleto: "", nacionalidad: "" });
  const [procesando, setProcesando] = useState(false);

  const filtrados = useMemo(() => {
    return directores.filter((d: any) => 
      d.NombreCompleto.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, directores]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / registrosPorPagina));
  const paginados = filtrados.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina);

  const handleSave = async () => {
    setProcesando(true);
    const res = await saveDirectorAction(editando);
    if (res.success) location.reload();
    else alert(res.error);
    setProcesando(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Deseas eliminar este director?")) {
      const res = await deleteDirectorAction(id);
      if (res.success) location.reload();
      else alert(res.error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-3xl font-bold text-slate-800">🎬 Catálogo de Directores</h2>
        {permisos.bitAgregar && (
          <button onClick={() => { setEditando({ id: 0, nombreCompleto: "", nacionalidad: "" }); setModalOpen(true); }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow transition-colors">
            + Nuevo Director
          </button>
        )}
      </div>

      <input 
        type="text" placeholder="Buscar por nombre..." 
        className="w-full md:w-1/2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500 outline-none mb-4"
        value={busqueda}
        onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4">Nombre Completo</th>
              <th className="p-4">Nacionalidad</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginados.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-10 text-slate-500">No se encontraron resultados.</td></tr>
            ) : (
              paginados.map((d: any) => (
                <tr key={d.Id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{d.NombreCompleto}</td>
                  <td className="p-4">{d.Nacionalidad || 'N/A'}</td>
                  <td className="p-4 text-center space-x-2">
                    {permisos.bitEditar && (
                      <button onClick={() => { setEditando({ id: d.Id, nombreCompleto: d.NombreCompleto, nacionalidad: d.Nacionalidad || "" }); setModalOpen(true); }}
                              className="text-blue-600 hover:text-blue-800 font-bold px-2 py-1 bg-blue-50 rounded">Editar</button>
                    )}
                    {permisos.bitEliminar && (
                      <button onClick={() => handleDelete(d.Id)}
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

      <div className="flex justify-between items-center mt-4 text-sm text-slate-600">
        <span>Página <strong>{paginaActual}</strong> de <strong>{totalPaginas}</strong></span>
        <div className="space-x-2">
          <button onClick={() => setPaginaActual(p => Math.max(1, p - 1))} disabled={paginaActual === 1} className="px-3 py-1 bg-white border rounded shadow-sm disabled:opacity-50">&laquo; Ant</button>
          <button onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas} className="px-3 py-1 bg-white border rounded shadow-sm disabled:opacity-50">Sig &raquo;</button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editando.id === 0 ? "Nuevo Director" : "Editar Director"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Nombre Completo</label>
                <input value={editando.nombreCompleto} onChange={e => setEditando({...editando, nombreCompleto: e.target.value})} className="w-full p-2 border rounded" autoFocus />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Nacionalidad</label>
                <input value={editando.nacionalidad} onChange={e => setEditando({...editando, nacionalidad: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancelar</button>
                <button onClick={handleSave} disabled={procesando} className="px-6 py-2 bg-purple-600 text-white font-bold rounded shadow hover:bg-purple-700 disabled:opacity-50">
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