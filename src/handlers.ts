import { warn } from "console";
import { readConfig, setUser } from "./config"
import { createUser, resetUsers, getUser, getUsers, getUserId, getUsernameFromId } from "./lib/db/queries/users"
import { createFeedFollows, getAllFeeds, getFeedId, getFeed, type Feed, getUserFollows } from "./lib/db/queries/feeds"
import { fetchFeed } from "./web"
import { addFeed, printFeed } from "./feed"
import { printFollowFeed } from "./follows";
import { name } from "drizzle-orm";
import { getUserObjFromName } from "./user";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandRegistry = Map<string, CommandHandler>;

export function registerCommand(registry: CommandRegistry, cmdName: string, handler: CommandHandler) {
	registry[cmdName] = handler
}

export async function runCommand(registry: CommandRegistry, cmdName: string, ...args: string[]) {
	registry[cmdName](cmdName, args);
}

export async function handlerLogin(cmdName: string, ...args: string[]) {
	if (!args.length) {
		throw Error("Please supply a username!")
	}

	const user = await getUser(args[0])

	if (!user.length) {
		throw Error(`User ${args[0]} doesn't exist!`)
	}

	console.log(`Type: ${typeof args[0]}`)
	console.log(`User: ${typeof user}`)
	setUser(args[0])

	console.log(`Username set to: ${args[0]}`)
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
	if (!args) {
		throw Error("Please supply a username!")
	}

	if (await getUser(args[0])) {
		await createUser(args[0])
	} else {
		throw Error(`User ${args[0]} already exists!`)
	}

	setUser(args[0])

	console.log(`User ${args[0]} was created.`)
}

export async function handlerReset(cmdName: string, ...args: string[]) {
	const delete_count = await resetUsers()
}

function getCurrentUsername() {
	const currentUser = readConfig().currentUserName
	return currentUser
}

export async function handlerUsers(cmdName: string, ...args: string[]) {
	const results = await getUsers()

	const currentUser = getCurrentUsername()

	console.log("Printing User List...")
	for (const user of results) {
		if (user.name === currentUser) {
			console.log(`${user.name} (current)`)
		} else {
			console.log(`${user.name}`)
		}
	}
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
	const feed = await fetchFeed("https://www.wagslane.dev/index.xml")
	console.log(`${JSON.stringify(feed)}}`)
}

export async function handlerAddfeed(cmdName: string, ...args: string[]) {
	if (!args[0] || typeof args[0] !== "string") {
		throw Error("Feed title is missing/incorrect type")
	}

	if (!args[1] || typeof args[1] !== "string") {

		throw Error("Url is missing/incorrect type")
	}

	const currentUser = getCurrentUsername()

	const result = await addFeed(args[0], args[1])
	const feedData = result[0]
	const feedObj: Feed = {
		id: feedData["id"],
		name: feedData["name"],
		url: feedData["url"],
		user_id: feedData["user_id"],
		createdAt: feedData["createdAt"],
		updatedAt: feedData["updatedAt"]
	}
	//	console.log("Feed was added: title: ", args[0], " url: ", args[1])
	const rawUser = await getUser(currentUser)
	await createFeedFollows(await getUserId(currentUser), feedObj.id)
	await printFeed(feedObj, rawUser[0])
}

export async function handlerGetfeeds(cmdName: string, ...args: string[]) {
	const result = await getAllFeeds()

	for (const feed of result) {
		const userName = await getUsernameFromId(feed.user_id)
		const userObj = await getUser(userName)
		printFeed(feed, userObj[0])
	}
}

export async function handlerAddFollow(cmdName: string, ...args: string[]) {
	const feed_id = await getFeedId(args[0])
	const result = await createFeedFollows(await getUserId(getCurrentUsername()), feed_id)

	printFollowFeed(result)
}

export async function handlerFollows(cmdName: string, ...args: string[]) {
	const results = await getUserFollows(getCurrentUsername())
	for (const result of results) {
		printFollowFeed(result)
	}
}
