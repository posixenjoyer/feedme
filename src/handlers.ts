import { warn } from "console";
import { readConfig, setUser } from "./config"
import { createUser, resetUsers, getUser, getUsers } from "./lib/db/queries/users"
import { fetchFeed } from "./web"

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

export async function handlerUsers(cmdName: string, ...args: string[]) {
	const results = await getUsers()

	const currentUser = readConfig().currentUserName

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
