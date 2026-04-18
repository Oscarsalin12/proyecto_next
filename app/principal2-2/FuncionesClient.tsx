"use client";
import { useState, useMemo } from "react";
import { saveFuncionesAction, deleteFuncionesAction } from "@/actions/funcionesActions";

export default function FuncionesClient({ datosIniciales, catalogos, permisos }: any) {
  const [funciones, setFunciones] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const [editando, setEditando] = useState({ 
    id: 0, idPelicula: 0, idSala: 0, fechaHora: "", precioBoleto: 60 
  });

  const filtradas = useMemo(() => {
    return funciones.filter((f: any) => 
      f.PeliculaTitulo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, funciones]);

  const handleSave = async () => {
    setProcesando(true);
    const res = await saveFuncionesAction(editando);
    if (res.success) location.reload();
    else alert(res.error);
    setProcesando(false);
  };

  const formatFecha = (fechaStr: string) => {
    const d = new Date(fechaStr);
    return d.toLocaleString('es-MX', { 
      weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-3xl font-bold text-slate-800">🗓️ Programación de Funciones</h2>
        {permisos.bitAgregar && (
          <button onClick={() => { setEditando({ id: 0, idPelicula: 0, idSala: 0, fechaHora: "", precioBoleto: 60 }); setModalOpen(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full shadow transition-colors">
            + Nueva Función
          </button>
        )}
      </div>

      <input 
        type="text" placeholder="Buscar por película..." 
        className="w-full md:w-1/3 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtradas.map((f: any) => (
          <div key={f.Id} className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${f.EsVIP ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-200 text-slate-600'}`}>
                {f.EsVIP ? 'SALA VIP' : 'ESTÁNDAR'}
              </span>
              <span className="text-emerald-600 font-bold">${f.PrecioBoleto}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{f.PeliculaTitulo}</h3>
            <p className="text-slate-500 text-sm mb-4">📍 {f.SalaNombre}</p>
            <div className="bg-slate-50 p-3 rounded-xl mb-4 text-center">
              <p className="text-indigo-600 font-black text-sm uppercase">{formatFecha(f.FechaHora)}</p>
            </div>
            
            <div className="flex space-x-2">
              {permisos.bitEditar && (
                <button onClick={() => { 
                  const d = new Date(f.FechaHora);
                  const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                  setEditando({ id: f.Id, idPelicula: f.IdPelicula, idSala: f.IdSala, fechaHora: localIso, precioBoleto: f.PrecioBoleto }); 
                  setModalOpen(true); 
                }} className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Editar</button>
              )}
              {permisos.bitEliminar && (
                <button onClick={async () => { if(confirm("¿Eliminar función?")) await deleteFuncionesAction(f.Id); location.reload(); }} 
                        className="flex-1 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Borrar</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4">{editando.id === 0 ? "Programar Función" : "Ajustar Función"}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Película</label>
                <select value={editando.idPelicula} onChange={e => setEditando({...editando, idPelicula: Number(e.target.value)})} className="w-full p-2 border rounded bg-white">
                  <option value="0">Seleccionar...</option>
                  {catalogos.peliculas.map((p:any) => <option key={p.Id} value={p.Id}>{p.Titulo}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Sala</label>
                <select value={editando.idSala} onChange={e => setEditando({...editando, idSala: Number(e.target.value)})} className="w-full p-2 border rounded bg-white">
                  <option value="0">Seleccionar...</option>
                  {catalogos.salas.map((s:any) => <option key={s.Id} value={s.Id}>{s.Nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Fecha y Hora</label>
                <input type="datetime-local" value={editando.fechaHora} onChange={e => setEditando({...editando, fechaHora: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Precio Boleto ($)</label>
                <input type="number" value={editando.precioBoleto} onChange={e => setEditando({...editando, precioBoleto: Number(e.target.value)})} className="w-full p-2 border rounded" />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancelar</button>
                <button onClick={handleSave} disabled={procesando} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded shadow hover:bg-indigo-700 disabled:opacity-50">
                  {procesando ? "Guardando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}