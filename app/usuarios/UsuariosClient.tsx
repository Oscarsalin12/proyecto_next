"use client";
import { useState } from "react";
import { saveUsuarioAction } from "@/actions/authActions";

export default function UsuariosClient({ usuariosIniciales, perfiles, permisos }: any) {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState({
    id: 0, strNombreUsuario: "", idPerfil: 0, strPwd: "",
    idEstadoUsuario: true, strCorreo: "", strNumeroCelular: ""
  });

  const handleSave = async () => {
    const res = await saveUsuarioAction(editando);
    if (res.success) {
      alert("Usuario guardado con éxito.");
      location.reload();
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Gestión de Usuarios</h1>
        
        {/* BOTÓN NUEVO: Condicionado al BitAgregar */}
        {permisos.bitAgregar && (
          <button onClick={() => { setEditando({ id: 0, strNombreUsuario: "", idPerfil: 0, strPwd: "", idEstadoUsuario: true, strCorreo: "", strNumeroCelular: "" }); setModalOpen(true); }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-colors">
            + Nuevo Usuario
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden border">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4">Usuario</th>
              <th className="p-4">Correo</th>
              <th className="p-4 text-center">Perfil</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u: any) => (
              <tr key={u.id} className="border-b hover:bg-slate-50 transition-all">
                <td className="p-4 font-bold text-slate-700">{u.strNombreUsuario}</td>
                <td className="p-4 text-slate-600">{u.strCorreo}</td>
                <td className="p-4 text-center">
                  <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-black uppercase">
                    {u.perfil?.strNombrePerfil}
                  </span>
                </td>
                <td className="p-4 text-center">
                  
                  {/* BOTÓN EDITAR: Condicionado al BitEditar */}
                  {permisos.bitEditar ? (
                    <button onClick={() => { setEditando(u); setModalOpen(true); }}
                      className="bg-slate-200 px-4 py-1 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-300 transition-colors">
                      Editar
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs italic italic">Solo lectura</span>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg animate-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Datos del Usuario</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre</label>
                <input value={editando.strNombreUsuario} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setEditando({ ...editando, strNombreUsuario: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Correo</label>
                <input value={editando.strCorreo || ""} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setEditando({ ...editando, strCorreo: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Contraseña</label>
                <input type="password" value={editando.strPwd} className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={editando.id !== 0 ? "••••••••" : "Mínimo 6 caracteres"}
                  onChange={(e) => setEditando({ ...editando, strPwd: e.target.value })} />
                {editando.id !== 0 && <p className="text-[10px] text-slate-400 mt-1">Dejar vacío si no desea cambiarla</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Perfil</label>
                <select value={editando.idPerfil} className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={(e) => setEditando({ ...editando, idPerfil: Number(e.target.value) })}>
                  <option value="0">Seleccionar Perfil...</option>
                  {perfiles.map((p: any) => <option key={p.id} value={p.id}>{p.strNombrePerfil}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
              <button onClick={() => setModalOpen(false)} className="font-bold text-slate-500 hover:text-slate-700">Cerrar</button>
              <button onClick={handleSave} className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors">
                Guardar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}