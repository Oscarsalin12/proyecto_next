"use server";
import { directoresService } from "@/services/directoresServices";
import { revalidatePath } from "next/cache";

export async function saveDirectorAction(data: any) {
  if (!data.nombreCompleto || data.nombreCompleto.trim() === "") {
    return { error: "El nombre del director es obligatorio." };
  }
  try {
    await directoresService.upsert(data);
    revalidatePath("/principal1-2"); // Limpiamos la caché de esta ruta
    return { success: true };
  } catch (e) {
    return { error: "Error al guardar el director." };
  }
}

export async function deleteDirectorAction(id: number) {
  try {
    await directoresService.eliminar(id);
    revalidatePath("/principal1-2");
    return { success: true };
  } catch (e) {
    return { error: "No se puede eliminar. Es posible que este director ya tenga películas asignadas." };
  }
}