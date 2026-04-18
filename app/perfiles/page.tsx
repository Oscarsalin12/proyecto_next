import { accountService } from "@/services/accountServices";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import PerfilesClient from "./PerfilesClient";

export default async function PerfilesPage() {
  const session = await getSession();
  if (!session) redirect("/");

  // ID del módulo de Perfiles según tu tabla es el 2
  const ID_MODULO_PERFILES = 2; 
  
  // Por defecto, permisos en falso (o true si es Admin)
  let permisos = { bitConsulta: true, bitAgregar: true, bitEditar: true, bitEliminar: true };

  if (!session.isAdmin) {
    const [rows]: any = await db.query(
      'SELECT BitConsulta, BitAgregar, BitEditar, BitEliminar FROM PermisosPerfiles WHERE IdPerfil = ? AND IdModulo = ?',
      [session.idPerfil, ID_MODULO_PERFILES]
    );

    // Si no tiene permiso de consulta, lo sacamos
    if (rows.length === 0 || rows[0].BitConsulta === 0) {
      redirect("/Principal");
    }
    
    permisos = {
      bitConsulta: rows[0].BitConsulta === 1,
      bitAgregar: rows[0].BitAgregar === 1,
      bitEditar: rows[0].BitEditar === 1,
      bitEliminar: rows[0].BitEliminar === 1,
    };
  }

  try {
    const lista = await accountService.obtenerPerfiles();
    return <PerfilesClient perfilesIniciales={lista || []} permisos={permisos} />;
  } catch (error) {
    return <div className="p-10 text-red-500 font-bold">Error de conexión con la base de datos.</div>;
  }
}