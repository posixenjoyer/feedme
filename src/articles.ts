import * as article from "./lib/db/queries/articles"

export interface RSSItem {
	title?: string,
	link?: string,
	url?: string,
	description?: string,
	pubDate?: string,
}

export async function createArticle(rssItem: RSSItem, feed_id: string) {
	if (!rssItem.link) {
		console.log("rssItem: ", rssItem)
		throw Error("Bad article URL")
	}

	if (!rssItem.title) {
		rssItem.title = "None."
	}

	if (!rssItem.description) {
		rssItem.description = "None."
	}

	return article.createArticle(rssItem.link, feed_id, rssItem.title, rssItem.description, rssItem.pubDate)
}

export async function getArticleTitle(url: string) {
	const articleXML = await getArticle(url)
	const title = articleXML["body"]["head"]["title"]
	return title
}

export async function getArticle(url: string) {
	return fetch(url).then((response) => {
		if (!response.ok) {
			throw new Error(
				`Unable to fetch feed article...
				Check URL, or Network connectivity 
				and dial again!`);
		} return response.text()
	})
		.catch((error) => { console.log(error) });
}

