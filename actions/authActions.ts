"use server";

import { loginSchema, perfilSchema, usuarioSchema } from "@/lib/zod";
import { accountService } from "@/services/accountServices";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// --- LOGIN ACTION ---
export async function loginAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData);
  
  const validated = loginSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Por favor, revisa los datos ingresados." };
  }

  const usuario = await accountService.validarLogin(
    validated.data.email,
    validated.data.password
  );

  if (!usuario) {
    return { error: "Correo o contraseña incorrectos." };
  }

  const token = await accountService.generarToken(usuario);
  
  (await cookies()).set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8 horas
    path: "/",
  });

  // El redirect debe ir al final, fuera de cualquier lógica compleja
  redirect("/principal");
}

// --- SAVE PERFIL ACTION ---
export async function savePerfilAction(data: any) {
  // Validamos los datos recibidos (ya sea FormData u objeto)
  const validated = perfilSchema.safeParse(data);
  if (!validated.success) return { error: "Datos de perfil inválidos" };

  try {
    await accountService.crearPerfil(validated.data);
    
    // Esto limpia la caché de la página de perfiles para que veas el nuevo registro inmediatamente
    revalidatePath("/perfiles"); 
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Error al crear perfil en la base de datos" };
  }
}

// --- SAVE USUARIO ACTION ---
export async function saveUsuarioAction(data: any) {
  const validated = usuarioSchema.safeParse(data);
  if (!validated.success) {
    // Retornamos el primer error que encuentre Zod
    return { error: validated.error.issues[0].message };
  }

  try {
    await accountService.upsertUsuario(validated.data);
    
    // Limpiamos la caché de la lista de usuarios
    revalidatePath("/usuarios");
    revalidatePath("/registro-usuarios"); // Si usas esta ruta también
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Error al guardar el usuario" };
  }


  }
   export async function logoutAction() {
    (await cookies()).delete("authToken");
    redirect("/"); 
}