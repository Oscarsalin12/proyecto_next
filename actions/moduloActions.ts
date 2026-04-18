"use server";
import { moduloService } from "@/services/moduloServices";
import { revalidatePath } from "next/cache";

export async function saveModuloAction(data: { id: number, strNombreModulo: string }) {
  if (!data.strNombreModulo || data.strNombreModulo.trim() === "") {
    return { error: "El nombre del módulo es obligatorio." };
  }

  try {
    await moduloService.upsertModulo(data);
    revalidatePath("/modulos");
    revalidatePath("/permisos"); // Limpiamos la caché de permisos porque agregamos un módulo nuevo
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Error al guardar el módulo en la base de datos." };
  }
}

export async function deleteModuloAction(id: number) {
  try {
    await moduloService.eliminarModulo(id);
    revalidatePath("/modulos");
    return { success: true };
  } catch (e) {
    return { error: "Error al eliminar. Es posible que este módulo ya tenga permisos asignados." };
  }
}