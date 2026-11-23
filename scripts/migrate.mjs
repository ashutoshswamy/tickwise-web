// node --env-file=.env.local scripts/migrate.mjs
import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const sql = neon(process.env.DATABASE_URL);
// Neon's HTTP driver runs one statement per call; schema.sql has no semicolons inside statements.
for (const stmt of readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8").split(";").map((s) => s.trim()).filter(Boolean)) {
  await sql.query(stmt);
}
console.log("schema ok");
