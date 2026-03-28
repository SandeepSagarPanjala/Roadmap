import { relations } from "drizzle-orm/relations";
import { users, exoplanets, refreshTokens } from "./schema.js";

export const exoplanetsRelations = relations(exoplanets, ({one}) => ({
	user: one(users, {
		fields: [exoplanets.leadResearcherId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	exoplanets: many(exoplanets),
}));