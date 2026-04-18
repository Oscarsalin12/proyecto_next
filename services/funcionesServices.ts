import { db } from "../lib/db";

export const funcionesService = {
  // Obtenemos las funciones uniendo Películas y Salas
  obtenerTodas: async () => {
    const query = `
      SELECT 
        f.Id, f.IdPelicula, f.IdSala, f.FechaHora, f.PrecioBoleto,
        p.Titulo AS PeliculaTitulo,
        s.Nombre AS SalaNombre,
        s.EsVIP
      FROM Funciones f
      INNER JOIN Peliculas p ON f.IdPelicula = p.Id
      INNER JOIN Salas s ON f.IdSala = s.Id
      ORDER BY f.FechaHora ASC
    `;
    const [rows] = await db.query(query);
    return rows as any[];
  },

  // Para los combos del Modal
  obtenerCatalogos: async () => {
    const [peliculas] = await db.query('SELECT Id, Titulo FROM Peliculas ORDER BY Titulo ASC');
    const [salas] = await db.query('SELECT Id, Nombre FROM Salas ORDER BY Nombre ASC');
    return { 
      peliculas: peliculas as any[], 
      salas: salas as any[] 
    };
  },

  upsert: async (data: any) => {
    // MySQL espera el formato YYYY-MM-DD HH:MM:SS
    const fechaSql = data.fechaHora.replace('T', ' ');

    if (!data.id || data.id === 0) {
      await db.query(
        'INSERT INTO Funciones (IdPelicula, IdSala, FechaHora, PrecioBoleto) VALUES (?, ?, ?, ?)', 
        [data.idPelicula, data.idSala, fechaSql, data.precioBoleto]
      );
    } else {
      await db.query(
        'UPDATE Funciones SET IdPelicula = ?, IdSala = ?, FechaHora = ?, PrecioBoleto = ? WHERE Id = ?', 
        [data.idPelicula, data.idSala, fechaSql, data.precioBoleto, data.id]
      );
    }
    return true;
  },

  eliminar: async (id: number) => {
    await db.query('DELETE FROM Funciones WHERE Id = ?', [id]);
    return true;
  }
};