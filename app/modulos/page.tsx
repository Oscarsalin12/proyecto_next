import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { moduloService } from "@/services/moduloServices";
import ModulosClient from "./ModulosClient";

export default async function ModulosPage() {
  const session = await getSession();

  // Equivalente a ValidarAdmin()
  if (!session || !session.isAdmin) {
    redirect("/principal");
  }

  // Traemos los módulos directamente desde la base de datos
  const modulos = await moduloService.obtenerModulos();

  return <ModulosClient modulosIniciales={modulos || []} />;
}