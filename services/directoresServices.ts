import { db } from "../lib/db";

export const directoresService = {
  obtenerTodos: async () => {
    const [rows] = await db.query('SELECT * FROM Directores ORDER BY Id DESC');
    return rows as any[];
  },

  upsert: async (data: { id: number, nombreCompleto: string, nacionalidad: string }) => {
    if (!data.id || data.id === 0) {
      await db.query('INSERT INTO Directores (NombreCompleto, Nacionalidad) VALUES (?, ?)', 
        [data.nombreCompleto, data.nacionalidad]);
    } else {
      await db.query('UPDATE Directores SET NombreCompleto = ?, Nacionalidad = ? WHERE Id = ?', 
        [data.nombreCompleto, data.nacionalidad, data.id]);
    }
    return true;
  },

  eliminar: async (id: number) => {
    await db.query('DELETE FROM Directores WHERE Id = ?', [id]);
    return true;
  }
};