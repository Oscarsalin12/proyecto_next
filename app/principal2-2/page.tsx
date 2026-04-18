import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { funcionesService } from "@/services/funcionesServices";
import { db } from "@/lib/db";
import FuncionesClient from "./FuncionesClient";

export default async function FuncionesPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const ID_MODULO_FUNCIONES = 7; 
  let permisos = { bitConsulta: true, bitAgregar: true, bitEditar: true, bitEliminar: true };

  if (!session.isAdmin) {
    const [rows]: any = await db.query(
      'SELECT BitConsulta, BitAgregar, BitEditar, BitEliminar FROM PermisosPerfiles WHERE IdPerfil = ? AND IdModulo = ?',
      [session.idPerfil, ID_MODULO_FUNCIONES]
    );

    if (rows.length === 0 || rows[0].BitConsulta === 0) {
      return <div className="p-10 text-red-600 font-bold">Acceso Denegado</div>;
    }
    permisos = {
      bitConsulta: rows[0].BitConsulta === 1,
      bitAgregar: rows[0].BitAgregar === 1,
      bitEditar: rows[0].BitEditar === 1,
      bitEliminar: rows[0].BitEliminar === 1,
    };
  }

  // Cargamos los datos de las funciones y los catálogos para los selects
  const funciones = await funcionesService.obtenerTodas();
  const catalogos = await funcionesService.obtenerCatalogos();

  return (
    <FuncionesClient 
      datosIniciales={funciones || []} 
      catalogos={catalogos} 
      permisos={permisos} 
    />
  );
}