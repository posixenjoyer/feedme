import { feeds } from "./lib/db/schema"
import { createFeed, getAllFeeds } from "./lib/db/queries/feeds"
import { getUserId } from "./lib/db/queries/users"
import { User } from "./user"
import { readConfig } from "./config"

export type Feed = typeof feeds.$inferSelect

export async function addFeed(title: string, url: string) {
	const configData = readConfig()
	if (!configData.currentUserName || typeof configData.currentUserName !== "string") {
		throw Error("Current username is invalid.  Exiting")
	}
	const userId = await getUserId(configData.currentUserName)

	if (!userId) {
		throw Error("Current user is invalid.  Exiting")
	}
	const result = await createFeed(title, url, userId)
	return result
}

export async function getFeeds() {
	const result = await getAllFeeds()
	return result
}

export async function printFeed(feed: Feed, user: User) {
	console.log("Title: ", feed.name)
	console.log("URL: ", feed.url)
	console.log("Created-at: ", feed.createdAt)

	console.log("User: ", user["name"])
}
