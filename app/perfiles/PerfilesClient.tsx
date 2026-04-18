"use client";
import { useState, useMemo } from "react";
import { savePerfilAction } from "@/actions/authActions";

export default function PerfilesClient({ perfilesIniciales, permisos }: any) {
  const [perfiles, setPerfiles] = useState(perfilesIniciales || []);
  const [filtro, setFiltro] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState({ id: 0, strNombrePerfil: "", bitAdministrador: false });

  const filtrados = useMemo(() => {
    return perfiles.filter((p: any) => 
      p.strNombrePerfil.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [filtro, perfiles]);

  const handleSave = async () => {
    const res = await savePerfilAction(editando);
    if (res.success) {
      alert("¡Perfil guardado correctamente!");
      location.reload(); 
    } else {
      alert(res.error || "Error al guardar el perfil");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Gestión de Perfiles</h1>
        
        {/* BOTÓN NUEVO: Condicionado al BitAgregar */}
        {permisos.bitAgregar && (
          <button onClick={() => { setEditando({id: 0, strNombrePerfil: "", bitAdministrador: false}); setModalOpen(true); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
            + Nuevo Perfil
          </button>
        )}
      </div>

      <input 
        type="text" placeholder="Buscar perfil..." 
        className="w-full p-3 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setFiltro(e.target.value)}
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4">Perfil</th>
              <th className="p-4 text-center">Admin</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p: any) => (
              <tr key={p.id} className="border-b hover:bg-slate-50 transition-all">
                <td className="p-4 font-medium">{p.strNombrePerfil}</td>
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${p.bitAdministrador ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {p.bitAdministrador ? 'SÍ' : 'NO'}
                  </span>
                </td>
                <td className="p-4 text-center">
                  
                  {/* BOTÓN EDITAR: Condicionado al BitEditar */}
                  {permisos.bitEditar ? (
                    <button onClick={() => { setEditando(p); setModalOpen(true); }} 
                            className="text-blue-600 font-bold hover:underline">Editar</button>
                  ) : (
                    <span className="text-slate-400 text-xs italic">Lectura</span>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: Sigue igual, ya que solo se abre si los botones anteriores existen */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm p-4 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-6 text-slate-800">{editando.id === 0 ? 'Crear' : 'Editar'} Perfil</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-500">Nombre</label>
                <input value={editando.strNombrePerfil} className="w-full border p-2 rounded-lg"
                       onChange={(e) => setEditando({...editando, strNombrePerfil: e.target.value})} />
              </div>
              <label className="flex items-center space-x-3 cursor-pointer p-3 bg-slate-50 rounded-lg">
                <input type="checkbox" checked={editando.bitAdministrador} className="w-5 h-5"
                       onChange={(e) => setEditando({...editando, bitAdministrador: e.target.checked})} />
                <span className="text-sm font-bold">¿Es Administrador?</span>
              </label>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button onClick={() => setModalOpen(false)} className="text-slate-500 font-bold">Cancelar</button>
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}