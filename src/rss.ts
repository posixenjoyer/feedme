export type RSSFeed = {
	title: string,
	link: string,
	description: string,
	item: RSSItem[],
}

export type RSSItem = {
	title: string,
	link: string,
	description: string,
	pubDate: string,
}

export function printRss(rssEntry: RSSItem) {

}
