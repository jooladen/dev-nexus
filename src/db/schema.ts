import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  motivation: text("motivation").notNull(),
  outcome: text("outcome").notNull(),
  features: jsonb("features").$type<string[]>().notNull(),
  techStack: jsonb("tech_stack").$type<string[]>().notNull(),
  githubUrl: text("github_url").notNull(),
});
