import { getSession } from "@/lib/auth";
import { logoutAction } from "@/actions/authActions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PrincipalPage() {
  // 1. Leemos el JWT desencriptado
  const session = await getSession();

  // Si alguien se salta el middleware, lo regresamos por seguridad
  if (!session) {
    redirect("/");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- BANNER DE BIENVENIDA --- */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl p-8 shadow-xl text-white flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Bienvenido, {session.nombre}
          </h1>
          <p className="text-blue-100 text-lg">
            Panel de control principal del sistema.
          </p>
        </div>
        <div className="bg-white/20 p-4 rounded-xl text-center backdrop-blur-sm">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-100">Tu Perfil</p>
          <p className="text-2xl font-black">
            {session.isAdmin ? "Administrador" : "Usuario Estándar"}
          </p>
        </div>
      </div>

      {/* --- TARJETAS DE ACCESO RÁPIDO --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tarjeta Usuarios */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Directorio de Usuarios</h2>
          </div>
          <p className="text-slate-500 mb-6">Gestiona los accesos, correos y contraseñas de las personas en el sistema.</p>
          <Link href="/usuarios" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg transition-colors">
            Ir a Usuarios &rarr;
          </Link>
        </div>

        {/* Tarjeta Perfiles (Solo visible si tiene permisos, aquí asumimos Admin para el ejemplo) */}
        {session.isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Control de Perfiles</h2>
            </div>
            <p className="text-slate-500 mb-6">Administra los roles y la matriz de permisos de toda la plataforma.</p>
            <Link href="/perfiles" className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg transition-colors">
              Ir a Perfiles &rarr;
            </Link>
          </div>
        )}

      </div>

      {/* --- BOTÓN DE SALIDA --- */}
      <div className="flex justify-end pt-8 border-t border-slate-200">
        <form action={logoutAction}>
          <button type="submit" className="flex items-center space-x-2 text-red-600 hover:text-red-800 hover:bg-red-50 font-bold py-2 px-4 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Cerrar Sesión</span>
          </button>
        </form>
      </div>

    </div>
  );
}