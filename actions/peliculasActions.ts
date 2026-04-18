"use server";
import { peliculasService } from "@/services/peliculasServices";
import { revalidatePath } from "next/cache";

export async function savePeliculaAction(data: any) {
  if (!data.titulo || data.titulo.trim() === "") {
    return { error: "El título de la película es obligatorio." };
  }
  try {
    await peliculasService.upsert(data);
    revalidatePath("/principal1-1");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Error al guardar la película." };
  }
}

export async function deletePeliculaAction(id: number) {
  try {
    await peliculasService.eliminar(id);
    revalidatePath("/principal1-1");
    return { success: true };
  } catch (e) {
    return { error: "Error al eliminar la película." };
  }
}