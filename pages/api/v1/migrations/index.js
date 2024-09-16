// @ts-ignore
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await database.getNewDBClient();
  const defaultMigrationOptions = {
    dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  } else if (request.method === "POST") {
    const completedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });
    await dbClient.end();

    if (completedMigrations.length > 0) {
      return response.status(201).json(completedMigrations);
    }
    return response.status(200).json(completedMigrations);
  }
  return response.status(405); //method not allowed
}
