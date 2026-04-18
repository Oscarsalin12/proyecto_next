import { accountService } from "@/services/accountServices";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import UsuariosClient from "./UsuariosClient";

export default async function UsuariosPage() {
  const session = await getSession();
  if (!session) redirect("/");

  // Según tu tabla de módulos, Usuarios es el ID 1
  const ID_MODULO_USUARIOS = 1; 
  
  let permisos = { bitConsulta: true, bitAgregar: true, bitEditar: true, bitEliminar: true };

  if (!session.isAdmin) {
    const [rows]: any = await db.query(
      'SELECT BitConsulta, BitAgregar, BitEditar, BitEliminar FROM PermisosPerfiles WHERE IdPerfil = ? AND IdModulo = ?',
      [session.idPerfil, ID_MODULO_USUARIOS]
    );

    // Si no tiene permiso de consulta, lo mandamos al inicio
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
    const lista = await accountService.obtenerUsuarios();
    const perfiles = await accountService.obtenerPerfiles();

    return (
      <UsuariosClient 
        usuariosIniciales={lista || []} 
        perfiles={perfiles || []} 
        permisos={permisos} 
      />
    );
    
  } catch (error) {
    console.error(error);
    return <div className="p-10 text-red-500 font-bold">Error al conectar con la base de datos.</div>;
  }
}