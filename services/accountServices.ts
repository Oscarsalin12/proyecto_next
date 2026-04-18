import { db } from "../lib/db";
import { SignJWT } from "jose";

export const accountService = {

  // --- 1. VALIDAR LOGIN ---
  validarLogin: async (correo: string, password: string) => {
    // Equivalente a un SqlCommand con parámetros para evitar inyección SQL
    const query = `
      SELECT 
        u.Id as id, 
        u.StrNombreUsuario as strNombreUsuario, 
        u.IdPerfil as idPerfil,
        p.BitAdministrador as bitAdministrador
      FROM Usuarios u
      INNER JOIN Perfiles p ON u.IdPerfil = p.Id
      WHERE u.StrCorreo = ? AND u.StrPwd = ? AND u.IdEstadoUsuario = 1
      LIMIT 1
    `;
    
    // Ejecutamos la consulta
    const [rows]: any = await db.query(query, [correo, password]);
    
    // Si no hay resultados, regresamos null (login fallido)
    if (rows.length === 0) return null;
    
    // Formateamos el objeto para que coincida con lo que espera el token
    const usuario = rows[0];
    return {
      id: usuario.id,
      strNombreUsuario: usuario.strNombreUsuario,
      idPerfil: usuario.idPerfil,
      perfil: {
        bitAdministrador: usuario.bitAdministrador === 1 || usuario.bitAdministrador === true
      }
    };
  },

  // --- 2. GENERAR TOKEN ---
  generarToken: async (usuario: any) => {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "clave_secreta_de_emergencia_32_caracteres"
    );

    // Buscar los módulos a los que tiene permiso de consulta
    const [permisos]: any = await db.query(
      'SELECT IdModulo FROM PermisosPerfiles WHERE IdPerfil = ? AND BitConsulta = 1',
      [usuario.idPerfil]
    );

    // Convertimos la lista de IDs en un string separado por comas (ej: "1,2,3")
    const listaModulos = permisos.map((p: any) => p.IdModulo.toString()).join(",");

    // Generamos el JWT
    return await new SignJWT({
      nombre: usuario.strNombreUsuario,
      idPerfil: usuario.idPerfil,
      isAdmin: usuario.perfil.bitAdministrador,
      modulos: listaModulos,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secret);
  },

  // --- 3. OBTENER PERFILES ---
  obtenerPerfiles: async () => {
    const [rows] = await db.query('SELECT * FROM Perfiles');
    return rows as any[];
  },

  // --- 4. OBTENER USUARIOS ---
  obtenerUsuarios: async () => {
    const query = `
      SELECT 
        u.Id, u.StrNombreUsuario, u.IdPerfil, u.StrCorreo, u.IdEstadoUsuario,
        p.StrNombrePerfil, p.BitAdministrador
      FROM Usuarios u
      LEFT JOIN Perfiles p ON u.IdPerfil = p.Id
    `;
    const [rows] = await db.query(query);
    
    return (rows as any[]).map((u) => ({
      id: u.Id,
      strNombreUsuario: u.StrNombreUsuario,
      strCorreo: u.StrCorreo,
      idPerfil: u.IdPerfil,
      idEstadoUsuario: u.IdEstadoUsuario,
      perfil: {
        strNombrePerfil: u.StrNombrePerfil,
        bitAdministrador: u.BitAdministrador
      }
    }));
  },

  // --- 5. CREAR PERFIL (Con transacción) ---
  crearPerfil: async (data: any) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [resultPerfil]: any = await connection.query(
        'INSERT INTO Perfiles (StrNombrePerfil, BitAdministrador) VALUES (?, ?)',
        [data.strNombrePerfil, data.bitAdministrador ? 1 : 0]
      );
      
      const nuevoId = resultPerfil.insertId;

      if (data.bitAdministrador) {
        const [modulos]: any = await connection.query('SELECT Id FROM Modulos');
        for (const mod of modulos) {
          await connection.query(
            `INSERT INTO PermisosPerfiles 
            (IdModulo, IdPerfil, BitAgregar, BitEditar, BitConsulta, BitEliminar, BitDetalle) 
            VALUES (?, ?, 1, 1, 1, 1, 1)`,
            [mod.Id, nuevoId]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw new Error("Fallo en la base de datos");
    } finally {
      connection.release();
    }
  },

  // --- 6. GUARDAR/ACTUALIZAR USUARIO ---
  upsertUsuario: async (data: any) => {
    if (!data.id || data.id === 0) {
      await db.query(
        `INSERT INTO Usuarios (StrNombreUsuario, IdPerfil, StrPwd, IdEstadoUsuario, StrCorreo, StrNumeroCelular) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.strNombreUsuario, data.idPerfil, data.strPwd, data.idEstadoUsuario ? 1 : 0, data.strCorreo, data.strNumeroCelular]
      );
    } else {
      if (data.strPwd && data.strPwd.trim() !== "") {
        await db.query(
          `UPDATE Usuarios SET StrNombreUsuario = ?, IdPerfil = ?, StrPwd = ?, IdEstadoUsuario = ?, StrCorreo = ?, StrNumeroCelular = ? WHERE Id = ?`,
          [data.strNombreUsuario, data.idPerfil, data.strPwd, data.idEstadoUsuario ? 1 : 0, data.strCorreo, data.strNumeroCelular, data.id]
        );
      } else {
        await db.query(
          `UPDATE Usuarios SET StrNombreUsuario = ?, IdPerfil = ?, IdEstadoUsuario = ?, StrCorreo = ?, StrNumeroCelular = ? WHERE Id = ?`,
          [data.strNombreUsuario, data.idPerfil, data.idEstadoUsuario ? 1 : 0, data.strCorreo, data.strNumeroCelular, data.id]
        );
      }
    }
    return true;
  }
};