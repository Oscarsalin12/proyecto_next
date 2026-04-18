import { db } from "../lib/db";

export const moduloService = {
  // Equivalente a: ObtenerModulos()
  obtenerModulos: async () => {
    const [rows] = await db.query('SELECT * FROM Modulos ORDER BY StrNombreModulo ASC');
    return rows as any[];
  },

  // Inserta si el ID es 0, actualiza si es mayor a 0
  upsertModulo: async (data: { id: number, strNombreModulo: string }) => {
    if (!data.id || data.id === 0) {
      await db.query('INSERT INTO Modulos (StrNombreModulo) VALUES (?)', [data.strNombreModulo]);
    } else {
      await db.query('UPDATE Modulos SET StrNombreModulo = ? WHERE Id = ?', [data.strNombreModulo, data.id]);
    }
    return true;
  },

  // Para borrar módulos (cuidado si ya tienen permisos asignados)
  eliminarModulo: async (id: number) => {
    await db.query('DELETE FROM Modulos WHERE Id = ?', [id]);
    return true;
  }
};