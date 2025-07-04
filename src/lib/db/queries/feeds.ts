import { db } from "..";
import { feeds, feed_follows, users } from "../schema";
import { getUser, getUserId, getUsernameFromId } from "./users";
import { eq } from "drizzle-orm";


export type Feed = typeof feeds.$inferSelect;

export async function createFeed(name: string, url: string, user_id: string) {
	const result = await db.insert(feeds).values({ name: name, url: url, user_id: user_id }).returning();
	return result
}

export async function getAllFeeds() {
	const result = await db.select().from(feeds)
	return result
}

export async function getUserFromFeed(feed_id: string) {
	const result = await db.select({ user_id: feeds.user_id }).from(feeds).where(eq(feeds.id, feed_id))

	return result[0]["user_id"]
}

export async function getUserFollows(username: string) {

	const result = await db.select({
		id: feed_follows.id,
		createdAt: feed_follows.createdAt,
		updatedAt: feed_follows.updatedAt,
		user_id: feed_follows.user_id,
		name: feeds.name,
		url: feeds.url,
		username: users.name,
		feed_id: feed_follows.feed_id
	}).from(feed_follows).
		innerJoin(feeds, eq(feed_follows.feed_id, feeds.id)).
		innerJoin(users, eq(feed_follows.user_id, users.id))
		.where(eq(feed_follows.user_id, await getUserId(username)))

	return result
}

export async function createFeedFollows(user_id: string, feed_id: string) {

	const [newFeedFollows] = await db.insert(feed_follows).values({ user_id: user_id, feed_id: feed_id })
		.returning()

	const result = await db.select({
		id: feed_follows.id,
		createdAt: feed_follows.createdAt,
		updatedAt: feed_follows.updatedAt,
		user_id: feed_follows.user_id,
		name: feeds.name,
		url: feeds.url,
		username: users.name,
		feed_id: feed_follows.feed_id
	}).from(feed_follows).
		innerJoin(feeds, eq(feed_follows.feed_id, feeds.id)).
		innerJoin(users, eq(feed_follows.user_id, users.id))
		.where(eq(feed_follows.id, newFeedFollows.id))

	if (newFeedFollows) {
		console.log("Feed.keys: ", Object.keys(newFeedFollows))
	}

	if (result) {
		console.log("Result: ", Object.keys(result))
	}
	return result[0]
}

export async function getFeed(feed_id: string) {
	const result = await db.select().from(feeds).where(eq(feeds.id, feed_id))
	return result
}

export async function getFeedId(url: string) {
	const result = await db.select().from(feeds).where(eq(feeds.url, url))
	return result[0]["id"]
}
