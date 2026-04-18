"use client";
import { useState } from "react";
import { saveModuloAction, deleteModuloAction } from "@/actions/moduloActions";

export default function ModulosClient({ modulosIniciales }: { modulosIniciales: any[] }) {
  const [modulos, setModulos] = useState(modulosIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState({ id: 0, strNombreModulo: "" });
  const [procesando, setProcesando] = useState(false);

  const handleSave = async () => {
    setProcesando(true);
    const res = await saveModuloAction(editando);
    if (res.success) {
      location.reload(); // Recarga para ver los cambios
    } else {
      alert(res.error);
    }
    setProcesando(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este módulo?")) {
      const res = await deleteModuloAction(id);
      if (res.success) {
        location.reload();
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            <svg className="w-6 h-6 inline-block mr-2 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Gestión de Módulos
          </h2>
          <p className="text-slate-500 mb-0">Listado oficial de módulos registrados en el sistema.</p>
        </div>
        <button 
          onClick={() => { setEditando({ id: 0, strNombreModulo: "" }); setModalOpen(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-md transition-colors flex items-center"
        >
          <span className="mr-1 text-lg leading-none">+</span> Nuevo Módulo
        </button>
      </div>

      {/* TABLA */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b-2 border-slate-100">
            <tr>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre del Módulo</th>
              <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {modulos.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-12 text-slate-400">
                  <p className="text-lg">No hay módulos disponibles.</p>
                </td>
              </tr>
            ) : (
              modulos.map((mod) => (
                <tr key={mod.id} className="border-b hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-6">
                    <div className="flex items-center">
                      {/* El equivalente a tu clase .icon-circle */}
                      <div className="bg-blue-500/10 w-9 h-9 flex items-center justify-center rounded-lg mr-4">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                      </div>
                      <span className="font-semibold text-slate-700">{mod.strNombreModulo}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-right space-x-2">
                    <button onClick={() => { setEditando(mod); setModalOpen(true); }} className="text-slate-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition-colors">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(mod.id)} className="text-slate-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-slate-800">
              {editando.id === 0 ? 'Crear Nuevo Módulo' : 'Modificar Módulo'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Nombre del Módulo</label>
                <input 
                  autoFocus
                  value={editando.strNombreModulo} 
                  className="w-full border-2 border-slate-200 p-3 rounded-lg outline-none focus:border-blue-500 transition-colors"
                  placeholder="Ej: Reportes"
                  onChange={(e) => setEditando({...editando, strNombreModulo: e.target.value})} 
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button onClick={() => setModalOpen(false)} className="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-lg">Cancelar</button>
                <button 
                  onClick={handleSave} 
                  disabled={procesando}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {procesando ? 'Guardando...' : 'Guardar Módulo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}