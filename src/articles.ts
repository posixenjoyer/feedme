import * as article from "./lib/db/queries/articles"

export async function createArticle(url: string, feed_id: string, title: string) {
	return article.createArticle(url, feed_id, title)
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

