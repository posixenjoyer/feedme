import { feeds } from "./lib/db/schema"
import { createFeed, getAllFeeds } from "./lib/db/queries/feeds"
import { getUserId } from "./lib/db/queries/users"
import { User } from "./user"
import { Article } from "./lib/db/queries/articles"
import { readConfig } from "./config"
import { XMLParser } from "fast-xml-parser"
import { createArticle } from "./articles"

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

export async function addFeedArticles(feedUrl: string, feed: string) {
	const data = await fetch(feedUrl)

	const dataParser = new XMLParser()
	const rssXML = dataParser.parse(await data.text())

	for (const item of rssXML["rss"]["channel"]["item"]) {
		const result = await createArticle(item["link"], feed, item["title"])
		console.log("Item url: ", result["url"])
	}
}
