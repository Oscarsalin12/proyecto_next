"use server";
import { permisosService } from "@/services/permisosServices";
import { revalidatePath } from "next/cache";

export async function getMatrizAction(idPerfil: number) {
  try {
    return await permisosService.obtenerMatrizPermisos(idPerfil);
  } catch (e) {
    return [];
  }
}

export async function saveMatrizAction(matriz: any[]) {
  try {
    const success = await permisosService.guardarPermisos(matriz);
    if (success) {
      // Limpiamos caché para que todo el sistema reconozca los nuevos permisos
      revalidatePath("/"); 
      return { success: true };
    }
    return { error: "No se pudo actualizar la matriz." };
  } catch (e) {
    return { error: "Error interno del servidor." };
  }
}