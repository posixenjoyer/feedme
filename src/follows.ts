export function printFollowFeed(feed: any) {
	const outputObj = {
		id: feed.id,
		createdAt: feed.createdAt,
		updatedAt: feed.updatedAt,
		name: feed.name,
		user: feed.username,
		url: feed.url
	}

	console.log("Feed id: ", outputObj.id)
	console.log("Title: ", outputObj.name)
	console.log("Url: ", outputObj.url)
	console.log("User: ", outputObj.user)
	console.log("CreatedAt: ", outputObj.createdAt)
	console.log("UpdatedAt: ", outputObj.updatedAt)
}
