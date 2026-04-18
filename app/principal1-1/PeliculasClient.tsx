"use client";
import { useState, useMemo } from "react";
import { savePeliculaAction, deletePeliculaAction } from "@/actions/peliculasActions";

export default function PeliculasClient({ datosIniciales, listaDirectores, permisos }: any) {
  const [peliculas, setPeliculas] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 5;

  const [modalOpen, setModalOpen] = useState(false);
  // Agregamos idDirector al estado inicial
  const [editando, setEditando] = useState({ id: 0, titulo: "", idDirector: 0, genero: "", anio: new Date().getFullYear() });
  const [procesando, setProcesando] = useState(false);

  const filtradas = useMemo(() => {
    return peliculas.filter((p: any) => 
      p.Titulo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, peliculas]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / registrosPorPagina));
  const paginadas = filtradas.slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina);

  const handleSave = async () => {
    setProcesando(true);
    const res = await savePeliculaAction(editando);
    if (res.success) location.reload();
    else alert(res.error);
    setProcesando(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Deseas eliminar esta película?")) {
      const res = await deletePeliculaAction(id);
      if (res.success) location.reload();
      else alert(res.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-3xl font-bold text-slate-800">🍿 Catálogo de Películas</h2>
        {permisos.bitAgregar && (
          <button onClick={() => { setEditando({ id: 0, titulo: "", idDirector: 0, genero: "", anio: new Date().getFullYear() }); setModalOpen(true); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow transition-colors">
            + Nueva Película
          </button>
        )}
      </div>

      <input 
        type="text" placeholder="Buscar por título..." 
        className="w-full md:w-1/2 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4"
        value={busqueda}
        onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4">Título</th>
              <th className="p-4">Director</th>
              <th className="p-4">Género</th>
              <th className="p-4 text-center">Año</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginadas.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-slate-500">No se encontraron resultados.</td></tr>
            ) : (
              paginadas.map((p: any) => (
                <tr key={p.Id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-800">{p.Titulo}</td>
                  {/* Aquí mostramos el nombre del director gracias al LEFT JOIN */}
                  <td className="p-4 text-slate-600">{p.DirectorNombre || <span className="italic text-slate-400">Sin Director</span>}</td>
                  <td className="p-4"><span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-bold uppercase">{p.Genero}</span></td>
                  <td className="p-4 text-center">{p.AnioLanzamiento}</td>
                  <td className="p-4 text-center space-x-2">
                    {permisos.bitEditar && (
                      <button onClick={() => { setEditando({ id: p.Id, titulo: p.Titulo, idDirector: p.IdDirector || 0, genero: p.Genero || "", anio: p.AnioLanzamiento }); setModalOpen(true); }}
                              className="text-blue-600 hover:text-blue-800 font-bold px-2 py-1 bg-blue-50 rounded">Editar</button>
                    )}
                    {permisos.bitEliminar && (
                      <button onClick={() => handleDelete(p.Id)}
                              className="text-red-600 hover:text-red-800 font-bold px-2 py-1 bg-red-50 rounded">Eliminar</button>
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
            <h2 className="text-xl font-bold mb-4">{editando.id === 0 ? "Nueva Película" : "Editar Película"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Título</label>
                <input value={editando.titulo} onChange={e => setEditando({...editando, titulo: e.target.value})} className="w-full p-2 border rounded" autoFocus />
              </div>
              
              {/* EL SELECT MÁGICO RELACIONADO */}
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Director</label>
                <select 
                  value={editando.idDirector} 
                  onChange={e => setEditando({...editando, idDirector: Number(e.target.value)})}
                  className="w-full p-2 border rounded bg-white"
                >
                  <option value="0">-- Seleccione un Director --</option>
                  {listaDirectores.map((dir: any) => (
                    <option key={dir.Id} value={dir.Id}>{dir.NombreCompleto}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Género</label>
                <input value={editando.genero} onChange={e => setEditando({...editando, genero: e.target.value})} className="w-full p-2 border rounded" placeholder="Ej: Acción, Drama" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Año de Lanzamiento</label>
                <input type="number" value={editando.anio} onChange={e => setEditando({...editando, anio: Number(e.target.value)})} className="w-full p-2 border rounded" />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancelar</button>
                <button onClick={handleSave} disabled={procesando} className="px-6 py-2 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700 disabled:opacity-50">
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