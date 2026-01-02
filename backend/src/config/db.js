import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || "database",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "saas_db",
  port: 5432
});

export default pool;
