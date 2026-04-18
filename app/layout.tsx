import "./globals.css";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/actions/authActions";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Función auxiliar para verificar si el usuario tiene permiso de ver un módulo
  const tieneAcceso = (idModulo: number) => {
    if (!session) return false;
    if (session.isAdmin) return true; // El admin ve todo
    if (!session.modulos) return false;
    
    // session.modulos es un string como "1,2,4"
    const idsPermitidos = session.modulos.split(",");
    return idsPermitidos.includes(idModulo.toString());
  };

  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        
        {session && (
          <nav className="bg-slate-900 text-white p-4 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              
              <Link href="/Principal" className="font-black text-xl tracking-tight flex items-center space-x-2">
                <span className="bg-blue-600 text-white px-2 py-1 rounded-md">CINE</span>
                <span>CORPORATIVO</span>
              </Link>

              <div className="flex items-center space-x-6 text-sm">
                
                {/* --- 1. CATÁLOGOS --- */}
                {(tieneAcceso(4) || tieneAcceso(5)) && (
                  <div className="group relative">
                    <button className="font-bold hover:text-blue-400 py-2 flex items-center">
                      1. Catálogos <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div className="absolute hidden group-hover:block bg-white text-slate-800 rounded-lg shadow-xl mt-1 w-48 border border-slate-200 overflow-hidden">
                      {tieneAcceso(4) && <Link href="/principal1-1" className="block px-4 py-3 hover:bg-blue-50 border-b">🍿 1.1 Películas</Link>}
                      {tieneAcceso(5) && <Link href="/principal1-2" className="block px-4 py-3 hover:bg-blue-50">🎬 1.2 Directores</Link>}
                    </div>
                  </div>
                )}

                {/* --- 2. OPERACIONES --- */}
                {(tieneAcceso(6) || tieneAcceso(7)) && (
                  <div className="group relative">
                    <button className="font-bold hover:text-blue-400 py-2 flex items-center">
                      2. Operaciones <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div className="absolute hidden group-hover:block bg-white text-slate-800 rounded-lg shadow-xl mt-1 w-48 border border-slate-200 overflow-hidden">
                      {tieneAcceso(6) && <Link href="/principal2-1" className="block px-4 py-3 hover:bg-blue-50 border-b">💺 2.1 Salas</Link>}
                      {tieneAcceso(7) && <Link href="/principal2-2" className="block px-4 py-3 hover:bg-blue-50">🗓️ 2.2 Funciones</Link>}
                    </div>
                  </div>
                )}

                {/* --- 3. SEGURIDAD --- */}
                {/* Aparece si es Admin O si tiene acceso a Usuarios(1) o Perfiles(2) */}
                {(session.isAdmin || tieneAcceso(1) || tieneAcceso(2)) && (
                  <div className="group relative">
                    <button className="font-bold text-yellow-400 hover:text-yellow-300 py-2 flex items-center">
                      🛡️ Seguridad <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div className="absolute hidden group-hover:block bg-white text-slate-800 rounded-lg shadow-xl mt-1 w-48 border border-slate-200 overflow-hidden right-0">
                      {tieneAcceso(1) && <Link href="/usuarios" className="block px-4 py-3 hover:bg-yellow-50 border-b">👥 Usuarios</Link>}
                      {tieneAcceso(2) && <Link href="/perfiles" className="block px-4 py-3 hover:bg-yellow-50 border-b">🎭 Perfiles</Link>}
                      
                      {/* Estos dos son estrictamente para el BIT ADMINISTRADOR real */}
                      {session.isAdmin && (
                        <>
                          <Link href="/modulos" className="block px-4 py-3 hover:bg-yellow-50 border-b">📦 Módulos</Link>
                          <Link href="/permisos" className="block px-4 py-3 hover:bg-yellow-50">🔐 Matriz de Permisos</Link>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="h-6 w-px bg-slate-700"></div> 
                
                <form action={logoutAction}>
                  <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors">
                    Salir
                  </button>
                </form>

              </div>
            </div>
          </nav>
        )}

        <main className="max-w-7xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}