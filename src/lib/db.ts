import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

const DATA_DIR = "data";
const DATABASE_FILE = "app.db";

let database: Database.Database | null = null;

export function getDatabasePath(): string {
  return path.join(process.cwd(), DATA_DIR, DATABASE_FILE);
}

export function ensureDataDirectory(): void {
  fs.mkdirSync(path.join(process.cwd(), DATA_DIR), { recursive: true });
}

export function getDb(): Database.Database {
  if (!database) {
    ensureDataDirectory();
    database = new Database(getDatabasePath());
    database.pragma("foreign_keys = ON");
  }

  return database;
}

export function closeDb(): void {
  if (!database) {
    return;
  }

  database.close();
  database = null;
}
