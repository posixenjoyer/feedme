import { XMLParser } from "fast-xml-parser";

type RSSFeed = {
	title: string,
	link: string,
	description: string,
	item: RSSItem[],
}

type RSSItem = {
	title: string,
	link: string,
	description: string,
	pubDate: string,
}

export async function fetchFeed(feedUrl: string) {
	const RSSResponse = await fetch(feedUrl, {
		method: "GET",
		headers: {
			'User-Agent': "gator",
			'COntent-Type': "application/xml",
		}
	})

	if (!RSSResponse) {
		throw Error("Bad feed url, no respone.")
	}

	const strResponse = await RSSResponse.text()
	const parsedResposne = new XMLParser()
	const feedData = parsedResposne.parse(strResponse)

	console.log(`type: ${typeof feedData} feedData: ${JSON.stringify(feedData)}`)
	if (!feedData["rss"]["channel"]) {
		throw Error("Channel field missing!")

	}

	const data = feedData["rss"]["channel"]

	let myFeed: RSSFeed = {
		title: data.title,
		link: data.link,
		description: data.description,
		item: [],
	}

	if (data["item"]) {
		if (Array.isArray(data["item"])) {
			for (const item of data.item) {
				if (!item.title || !item.link || !item.description || !item.pubDate) {
					continue
				}

				const rssItem: RSSItem = {
					title: item.title,
					link: item.link,
					description: item.description,
					pubDate: item.pubDate,
				}
				console.log(`Adding item ${JSON.stringify(rssItem)}`)
				myFeed.item.push(rssItem)
			}
		}

	}
	return myFeed
}

