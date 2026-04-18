import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio.")
    .email("Formato de correo inválido."),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .max(20, "La contraseña no puede exceder los 20 caracteres."),
});
export const perfilSchema = z.object({
  id: z.number().optional(),
  strNombrePerfil: z
    .string()
    .min(3, "El nombre debe tener entre 3 y 30 caracteres.")
    .max(30, "El nombre debe tener entre 3 y 30 caracteres.")
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/, "No se permiten caracteres especiales."),
  bitAdministrador: z.boolean().default(false),
});

// Validación de Usuario
export const usuarioSchema = z.object({
  id: z.number().optional(),
  strNombreUsuario: z.string().min(1, "Nombre obligatorio").max(50),
  idPerfil: z.coerce.number().min(1, "Selecciona un perfil"),
  strPwd: z.string().min(6, "Mínimo 6 caracteres"),
  idEstadoUsuario: z.boolean().default(true),
  strCorreo: z.string().email("Correo inválido").nullable(),
  strNumeroCelular: z.string().nullable(),
});