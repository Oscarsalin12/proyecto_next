"use client";
import { useActionState } from "react";
import { loginAction } from "@/actions/authActions";

export default function LoginPage() {
  // useActionState es el hook moderno de React 19 para manejar formularios
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-700">SISTEMA CORPORATIVO</h1>
          <p className="text-slate-500 text-sm">Panel de Gestión Administrativa</p>
        </div>

        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="admin@empresa.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Contraseña</label>
            <input
              name="password"
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all disabled:bg-slate-400"
          >
            {isPending ? "Validando..." : "Entrar al panel"}
          </button>
        </form>
      </div>
    </div>
  );
}