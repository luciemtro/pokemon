// lib/db.ts
import mysql, { Pool } from "mysql2/promise";

// Créer un pool de connexions pour toutes les requêtes (GET, POST, etc.)
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  waitForConnections: true,
  connectionLimit: 10, // Limite du nombre de connexions simultanées
  queueLimit: 0, // Pas de limite sur la file d'attente
});

// Fonction pour obtenir une connexion depuis le pool
export const getConnection = async () => {
  return pool.getConnection(); // Retourne une connexion depuis le pool
};
