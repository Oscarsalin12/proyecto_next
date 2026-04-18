import { db } from "../lib/db";

export const peliculasService = {
  // Traemos las películas uniendo la tabla de Directores
  obtenerTodas: async () => {
    const query = `
      SELECT 
        p.Id, p.Titulo, p.IdDirector, p.Genero, p.AnioLanzamiento,
        d.NombreCompleto AS DirectorNombre
      FROM Peliculas p
      LEFT JOIN Directores d ON p.IdDirector = d.Id
      ORDER BY p.Id DESC
    `;
    const [rows] = await db.query(query);
    return rows as any[];
  },

  // Necesitamos esta función para llenar el <select> del modal
  obtenerListaDirectores: async () => {
    const [rows] = await db.query('SELECT Id, NombreCompleto FROM Directores ORDER BY NombreCompleto ASC');
    return rows as any[];
  },

  upsert: async (data: { id: number, titulo: string, idDirector: number, genero: string, anio: number }) => {
    // Si manda 0 en el select, lo convertimos a NULL para la base de datos
    const dirId = data.idDirector > 0 ? data.idDirector : null;

    if (!data.id || data.id === 0) {
      await db.query('INSERT INTO Peliculas (Titulo, IdDirector, Genero, AnioLanzamiento) VALUES (?, ?, ?, ?)', 
        [data.titulo, dirId, data.genero, data.anio]);
    } else {
      await db.query('UPDATE Peliculas SET Titulo = ?, IdDirector = ?, Genero = ?, AnioLanzamiento = ? WHERE Id = ?', 
        [data.titulo, dirId, data.genero, data.anio, data.id]);
    }
    return true;
  },

  eliminar: async (id: number) => {
    await db.query('DELETE FROM Peliculas WHERE Id = ?', [id]);
    return true;
  }
};