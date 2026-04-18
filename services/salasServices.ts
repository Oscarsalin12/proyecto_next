import { db } from "../lib/db";

export const salasService = {
  obtenerTodas: async () => {
    const [rows] = await db.query('SELECT * FROM Salas ORDER BY Nombre ASC');
    
    // Traducimos el 1/0 a true/false para React
    return (rows as any[]).map(r => ({
      id: r.Id,
      nombre: r.Nombre,
      capacidadAsientos: r.CapacidadAsientos,
      esVIP: r.EsVIP === 1 
    }));
  },

  upsert: async (data: { id: number, nombre: string, capacidadAsientos: number, esVIP: boolean }) => {
    // Traducimos el true/false a 1/0 para MySQL
    const vipNum = data.esVIP ? 1 : 0;

    if (!data.id || data.id === 0) {
      await db.query('INSERT INTO Salas (Nombre, CapacidadAsientos, EsVIP) VALUES (?, ?, ?)', 
        [data.nombre, data.capacidadAsientos, vipNum]);
    } else {
      await db.query('UPDATE Salas SET Nombre = ?, CapacidadAsientos = ?, EsVIP = ? WHERE Id = ?', 
        [data.nombre, data.capacidadAsientos, vipNum, data.id]);
    }
    return true;
  },

  eliminar: async (id: number) => {
    await db.query('DELETE FROM Salas WHERE Id = ?', [id]);
    return true;
  }
};