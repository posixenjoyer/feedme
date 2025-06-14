import { warn } from "console";
import { setUser } from "./config"
import { createUser, getUser } from "./lib/db/queries/users"

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
