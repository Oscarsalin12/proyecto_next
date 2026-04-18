"use server";
import { funcionesService } from "@/services/funcionesServices";
import { revalidatePath } from "next/cache";

export async function saveFuncionesAction(data: any) {
  if (data.idPelicula === 0 || data.idSala === 0) {
    return { error: "Debes seleccionar una película y una sala." };
  }
  if (!data.fechaHora) return { error: "La fecha y hora son obligatorias." };

  try {
    await funcionesService.upsert(data);
    revalidatePath("/principal2-2");
    return { success: true };
  } catch (e) {
    return { error: "Error al programar la función." };
  }
}

export async function deleteFuncionesAction(id: number) {
  try {
    await funcionesService.eliminar(id);
    revalidatePath("/principal2-2");
    return { success: true };
  } catch (e) {
    return { error: "Error al eliminar la función." };
  }
}