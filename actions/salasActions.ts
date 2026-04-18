"use server";
import { salasService } from "@/services/salasServices";
import { revalidatePath } from "next/cache";

export async function saveSalaAction(data: any) {
  if (!data.nombre || data.nombre.trim() === "") {
    return { error: "El nombre de la sala es obligatorio." };
  }
  if (data.capacidadAsientos <= 0) {
    return { error: "La capacidad debe ser mayor a cero." };
  }
  
  try {
    await salasService.upsert(data);
    revalidatePath("/principal2-1"); // Limpiamos caché
    return { success: true };
  } catch (e) {
    return { error: "Error al guardar la sala." };
  }
}

export async function deleteSalaAction(id: number) {
  try {
    await salasService.eliminar(id);
    revalidatePath("/principal2-1");
    return { success: true };
  } catch (e) {
    return { error: "Error al eliminar. Puede que esta sala ya tenga funciones programadas." };
  }
}