import { articles } from "../schema"
import { db } from "..";

export type Article = typeof articles.$inferSelect

export async function createArtcles(articles: Article[]) {
	let resultArticles: Article[] = []

	for (const article of articles) {
		const result = await createArticle(article.url, article.feed_id, article.name)
		if (result) {
			console.log(`Added article:\nTitle: ${article.name}\nUrl: ${article.url}`)
			resultArticles.push(result)
		} else {
			throw Error("Error adding article :")
		}
	}

	return (resultArticles)
}

export async function createArticle(url: string, feed_id: string, name?: string, desc?: string, pubAt?: (string | number)) {

	if (!name) {
		name = "None"
	}

	const pubDate = pubAt ? new Date(pubAt) : new Date(0)
	const description = desc ? desc : "N/A"

	const result = await db.insert(articles).values({
		url: url,
		feed_id: feed_id,
		name: name,
		description: description,
		publishedAt: pubDate,
	})
		.returning()
	console.log("Article Insert: ", result)
	return result[0]

}
