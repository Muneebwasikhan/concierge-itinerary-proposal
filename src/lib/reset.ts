import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { closeDb, ensureDataDirectory, getDatabasePath } from "./db";
import { seedDatabase, type SeedResult } from "./seed";

function removeDatabaseFiles(): void {
  const databasePath = getDatabasePath();

  for (const filePath of [databasePath, `${databasePath}-shm`, `${databasePath}-wal`]) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export function resetDatabase(): SeedResult {
  closeDb();
  ensureDataDirectory();
  removeDatabaseFiles();

  return seedDatabase();
}

function isDirectRun(): boolean {
  return path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url);
}

if (isDirectRun()) {
  const result = resetDatabase();

  console.log(
    `Database reset complete: James Whitfield member #${result.memberId}, Villa Punta Mita reservation #${result.reservationId}.`,
  );

  closeDb();
}
