import { db } from "../lib/db";

export const permisosService = {
  // Equivalente a: ObtenerMatrizPermisos(int idPerfil)
 obtenerMatrizPermisos: async (idPerfil: number) => {
    // MAGIA SQL: Empezamos en Modulos y hacemos LEFT JOIN.
    // Usamos IFNULL para que si el permiso no existe, devuelva 0 en lugar de null.
    const query = `
      SELECT 
        IFNULL(p.Id, 0) AS Id, 
        m.Id AS IdModulo, 
        ? AS IdPerfil, 
        IFNULL(p.BitAgregar, 0) AS BitAgregar, 
        IFNULL(p.BitEditar, 0) AS BitEditar, 
        IFNULL(p.BitConsulta, 0) AS BitConsulta, 
        IFNULL(p.BitEliminar, 0) AS BitEliminar, 
        IFNULL(p.BitDetalle, 0) AS BitDetalle,
        m.StrNombreModulo
      FROM Modulos m
      LEFT JOIN PermisosPerfiles p ON m.Id = p.IdModulo AND p.IdPerfil = ?
      ORDER BY m.StrNombreModulo ASC
    `;
    
    // Pasamos idPerfil dos veces (para los dos signos '?' en la consulta)
    const [rows]: any = await db.query(query, [idPerfil, idPerfil]);
    
    return rows.map((r: any) => ({
      id: r.Id,
      idModulo: r.IdModulo,
      idPerfil: r.IdPerfil,
      strNombreModulo: r.StrNombreModulo,
      bitConsulta: r.BitConsulta === 1,
      bitAgregar: r.BitAgregar === 1,
      bitEditar: r.BitEditar === 1,
      bitEliminar: r.BitEliminar === 1,
      bitDetalle: r.BitDetalle === 1
    }));
  },

  // Equivalente a: GuardarPermisos(List<PermisosPerfil> matriz)
  guardarPermisos: async (matriz: any[]) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      for (const permiso of matriz) {
        if (permiso.id === 0) {
          // Add
          await connection.query(
            `INSERT INTO PermisosPerfiles (IdModulo, IdPerfil, BitAgregar, BitEditar, BitConsulta, BitEliminar, BitDetalle) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [permiso.idModulo, permiso.idPerfil, permiso.bitAgregar ? 1:0, permiso.bitEditar ? 1:0, permiso.bitConsulta ? 1:0, permiso.bitEliminar ? 1:0, permiso.bitDetalle ? 1:0]
          );
        } else {
          // Update
          await connection.query(
            `UPDATE PermisosPerfiles 
             SET BitAgregar = ?, BitEditar = ?, BitConsulta = ?, BitEliminar = ?, BitDetalle = ? 
             WHERE Id = ?`,
            [permiso.bitAgregar ? 1:0, permiso.bitEditar ? 1:0, permiso.bitConsulta ? 1:0, permiso.bitEliminar ? 1:0, permiso.bitDetalle ? 1:0, permiso.id]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error("Error al guardar permisos:", error);
      return false;
    } finally {
      connection.release();
    }
  }
};