import * as feed from "./lib/db/queries/feeds"

export async function createArticle(url: string, feed_id: string) {
	const title = getArticleTitle(url)
	console.log("Retrieved title: ", title)
	return feed.createFollowedArticle(url, feed_id, title)
}

export function getArticleTitle(url: string) {
	const articleJson = getArticle(url)
	const title = articleJson["body"]["head"]["title"]
	return title
}

export function getArticle(url: string) {
	return fetch(url).then((response) => {
		if (!response.ok) {
			throw new Error(
				`Unable to fetch feed article...
				Check URL, or Network connectivity 
				and dial again!`);
		} return response.json()
	})
		.then((data) => { data.results[0] })
		.catch((error) => { console.log(error) });
}

