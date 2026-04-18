import mysql from 'mysql2/promise';

// Esto equivale a tu SqlConnection de ADO.NET
// Lee directamente tu cadena de conexión del archivo .env
export const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10, // Máximo de conexiones simultáneas
  waitForConnections: true
});