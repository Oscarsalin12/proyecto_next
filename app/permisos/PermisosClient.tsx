"use client";
import { useState } from "react";
import { getMatrizAction, saveMatrizAction } from "@/actions/permisosActions";

export default function PermisosClient({ perfiles }: { perfiles: any[] }) {
  const [idPerfil, setIdPerfil] = useState(0);
  const [matriz, setMatriz] = useState<any[]>([]);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string, tipo: 'success' | 'error' } | null>(null);

  // Equivalente a OnPerfilSelected
  const handlePerfilChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setIdPerfil(id);
    setMensaje(null);
    
    if (id > 0) {
      setProcesando(true);
      const data = await getMatrizAction(id);
      setMatriz(data);
      setProcesando(false);
    } else {
      setMatriz([]);
    }
  };

  // Función para manejar el cambio individual de cada checkbox (El @bind de Blazor)
  const handleCheckboxChange = (idModulo: number, campo: string, valor: boolean) => {
    setMatriz(prev => prev.map(permiso => 
      permiso.idModulo === idModulo ? { ...permiso, [campo]: valor } : permiso
    ));
  };

  // Equivalente a GuardarTodo
const handleGuardar = async () => {
    if (matriz.length === 0) return;
    
    setProcesando(true);
    const res = await saveMatrizAction(matriz);
    
    if (res.success) {
      // Usamos un alert tradicional y recargamos para evitar IDs "fantasma"
      alert("Matriz de permisos actualizada correctamente.");
      location.reload(); 
    } else {
      setMensaje({ texto: res.error || "Error al actualizar la matriz.", tipo: "error" });
      setProcesando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Alerta tipo JS */}
      {mensaje && (
        <div className={`p-4 rounded-lg font-bold ${mensaje.tipo === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-600' : 'bg-red-100 text-red-800 border-l-4 border-red-600'}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
          <h5 className="mb-0 text-lg font-bold">Matriz de Permisos por Perfil</h5>
          <span className="bg-yellow-400 text-yellow-900 text-xs font-black uppercase px-2 py-1 rounded">Modo Administrador</span>
        </div>
        
        <div className="p-6">
          <div className="mb-6 max-w-md">
            <label className="block font-bold text-slate-500 text-xs uppercase mb-2">1. Seleccione el Perfil a modificar:</label>
            <select 
              className="w-full border-2 border-blue-200 p-3 rounded-lg outline-none focus:border-blue-500" 
              value={idPerfil} 
              onChange={handlePerfilChange}
            >
              <option value="0">-- Elija un perfil del sistema --</option>
              {perfiles.map(p => (
                <option key={p.id} value={p.id}>{p.strNombrePerfil}</option>
              ))}
            </select>
          </div>

          {idPerfil > 0 ? (
            <div className="animate-in fade-in duration-500">
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-600 text-sm">
                    <tr>
                      <th className="p-4 border-b font-bold">Módulo del Sistema</th>
                      <th className="p-4 border-b text-center font-bold">Ver</th>
                      <th className="p-4 border-b text-center font-bold">Crear</th>
                      <th className="p-4 border-b text-center font-bold">Editar</th>
                      <th className="p-4 border-b text-center font-bold">Borrar</th>
                      <th className="p-4 border-b text-center font-bold">Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matriz.map(permiso => (
                      <tr key={permiso.idModulo} className="border-b hover:bg-slate-50">
                        <td className="p-4 font-bold text-blue-600">{permiso.strNombreModulo}</td>
                        <td className="p-4 text-center"><input type="checkbox" checked={permiso.bitConsulta} onChange={(e) => handleCheckboxChange(permiso.idModulo, 'bitConsulta', e.target.checked)} className="w-5 h-5 accent-blue-600 cursor-pointer" /></td>
                        <td className="p-4 text-center"><input type="checkbox" checked={permiso.bitAgregar} onChange={(e) => handleCheckboxChange(permiso.idModulo, 'bitAgregar', e.target.checked)} className="w-5 h-5 accent-blue-600 cursor-pointer" /></td>
                        <td className="p-4 text-center"><input type="checkbox" checked={permiso.bitEditar} onChange={(e) => handleCheckboxChange(permiso.idModulo, 'bitEditar', e.target.checked)} className="w-5 h-5 accent-blue-600 cursor-pointer" /></td>
                        <td className="p-4 text-center"><input type="checkbox" checked={permiso.bitEliminar} onChange={(e) => handleCheckboxChange(permiso.idModulo, 'bitEliminar', e.target.checked)} className="w-5 h-5 accent-blue-600 cursor-pointer" /></td>
                        <td className="p-4 text-center"><input type="checkbox" checked={permiso.bitDetalle} onChange={(e) => handleCheckboxChange(permiso.idModulo, 'bitDetalle', e.target.checked)} className="w-5 h-5 accent-blue-600 cursor-pointer" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 text-right">
                <button 
                  onClick={handleGuardar} 
                  disabled={procesando}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg disabled:opacity-50 transition-colors"
                >
                  {procesando ? 'Guardando...' : 'Actualizar Matriz de Seguridad'}
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 rounded-xl text-center py-12 text-slate-500 bg-slate-50">
              <p className="font-bold">Seleccione un perfil arriba para cargar sus permisos actuales.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}