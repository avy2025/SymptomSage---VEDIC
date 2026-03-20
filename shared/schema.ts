import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  role: text("role", { enum: ["user", "vedic"] }).notNull(),
  content: text("content").notNull(),
  urgency: text("urgency", { enum: ["low", "medium", "high", "critical"] }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Shared API types
export const chatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  sessionId: z.string().min(1, "Session ID is required"),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
