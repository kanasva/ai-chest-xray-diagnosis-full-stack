import { timestamp, text, serial, pgTable, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  googleId: text("google_id"),
  githubId: text("github_id"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  createAt: timestamp("create_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const userQuotas = pgTable("user_quotas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  remainingQuota: integer("remaining_quota").notNull(),
  createAt: timestamp("create_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const config = pgTable("config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  createAt: timestamp("create_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferSelect;
