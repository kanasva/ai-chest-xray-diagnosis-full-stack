import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migration",
  dialect: "postgresql",
  introspect: {
    casing: "camel",
  },
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
