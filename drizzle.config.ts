import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "expo",
  schema: "./src/shared/database/schema.ts",
  out: "./src/shared/database/migrations",
});
