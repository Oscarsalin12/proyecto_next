import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { accountService } from "@/services/accountServices";
import PermisosClient from "./PermisosClient";

export default async function PermisosPage() {
  const session = await getSession();

  // Equivalente a [Authorize] y ValidarAccesoAdmin()
  if (!session || !session.isAdmin) {
    redirect("/principal");
  }

  // Si pasó, le mandamos la lista de perfiles para llenar el <select>
  const perfiles = await accountService.obtenerPerfiles();

  return <PermisosClient perfiles={perfiles || []} />;
}