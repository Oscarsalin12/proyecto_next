import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { peliculasService } from "@/services/peliculasServices";
import { db } from "@/lib/db";
import PeliculasClient from "./PeliculasClient";

export default async function PeliculasPage() {
  const session = await getSession();
  if (!session) redirect("/");

  // ATENCIÓN: Verifica el ID de tu módulo Películas en la BD
  const ID_MODULO_PELICULAS = 4; 
  
  let permisos = { bitConsulta: true, bitAgregar: true, bitEditar: true, bitEliminar: true };

  if (!session.isAdmin) {
    const [rows]: any = await db.query(
      'SELECT BitConsulta, BitAgregar, BitEditar, BitEliminar FROM PermisosPerfiles WHERE IdPerfil = ? AND IdModulo = ?',
      [session.idPerfil, ID_MODULO_PELICULAS]
    );

    if (rows.length === 0 || rows[0].BitConsulta === 0) {
      return (
        <div className="p-10 max-w-2xl mx-auto mt-10 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
          <h2 className="text-red-800 text-2xl font-bold mb-2">Acceso Denegado</h2>
          <p className="text-red-600">No tienes permisos para visualizar el catálogo de películas.</p>
        </div>
      );
    }
    
    permisos = {
      bitConsulta: rows[0].BitConsulta === 1,
      bitAgregar: rows[0].BitAgregar === 1,
      bitEditar: rows[0].BitEditar === 1,
      bitEliminar: rows[0].BitEliminar === 1,
    };
  }

  // Traemos las películas Y la lista de directores para el Select
  const peliculas = await peliculasService.obtenerTodas();
  const directores = await peliculasService.obtenerListaDirectores();

  return <PeliculasClient 
            datosIniciales={peliculas || []} 
            listaDirectores={directores || []} 
            permisos={permisos} 
          />;
}