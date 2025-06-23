import { pgTable, timestamp, uuid, text, unique } from 'drizzle-orm/pg-core';

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow()
		.$onUpdate(() => new Date()),
	name: text("name").notNull().unique()
})

export const feeds = pgTable("feeds", {
	id: uuid("id").primaryKey().defaultRandom().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	name: text("name").notNull(),
	url: text("url").notNull().unique(),
	user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade', }),
})

export const feed_follows = pgTable("feed_follows", {
	id: uuid("id").primaryKey().defaultRandom().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	user_id: uuid('user_id').references(() => users.id, { onDelete: 'cascade', }),
	feed_id: uuid('feed_id').references(() => feeds.id, { onDelete: 'cascade', }),
}, (t) => [
	unique().on(t.user_id, t.feed_id)
])

export const followed_feeds = pgTable("followed_feeds", {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	lastChecked: timestamp("lastChecked").notNull().defaultNow(),
	name: text("name"),
	url: text("url").notNull(),
	feed_id: uuid('feed_id').references(() => feeds.id, { onDelete: 'cascade', }),
}, (t) => [
	unique().on(t.feed_id, t.url)
])
