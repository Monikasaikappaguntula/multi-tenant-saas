import fs from "fs";
import path from "path";
import pool from "../config/db.js";

const MIGRATIONS_DIR = "/app/database/migrations";

const runMigrations = async () => {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    console.log(`Running migration: ${file}`);
    const sql = fs.readFileSync(
      path.join(MIGRATIONS_DIR, file),
      "utf8"
    );
    await pool.query(sql);
  }

  console.log("✅ All migrations executed successfully");
};

export default runMigrations;
