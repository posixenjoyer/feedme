import dotenv from 'dotenv';
import { readConfig, setUser } from "./config";
import * as Handlers from "./handlers";
import { drizzle } from "drizzle-orm/postgres-js";
import { getUser } from './lib/db/queries/users';


async function main() {
	const registry: Handlers.CommandRegistry = new Map()
	const loggedIn = (handler: Handlers.UserCommandHandler) => {
		return async (cmdName, ...args) => {
			const rawConfig = readConfig()
			const user = await getUser(rawConfig.currentUserName)
			if (!user[0]) {
				throw Error("User not found!")
			} else {
				await handler(cmdName, user[0], ...args)
			}
		}
	}
	dotenv.config()

	Handlers.registerCommand(registry, "login", Handlers.handlerLogin)
	Handlers.registerCommand(registry, "register", Handlers.handlerRegister)
	Handlers.registerCommand(registry, "reset", Handlers.handlerReset)
	Handlers.registerCommand(registry, "users", Handlers.handlerUsers)
	Handlers.registerCommand(registry, "agg", Handlers.handlerAgg)
	Handlers.registerCommand(registry, "addfeed", loggedIn(Handlers.handlerAddfeed));
	Handlers.registerCommand(registry, "feeds", Handlers.handlerGetfeeds)
	Handlers.registerCommand(registry, "follow", loggedIn(Handlers.handlerAddFollow))
	Handlers.registerCommand(registry, "following", loggedIn(Handlers.handlerFollows))
	Handlers.registerCommand(registry, "unfollow", loggedIn(Handlers.handlerUnfollow))




	const cmdName = process.argv[2]
	const handlerArgs = process.argv.slice(3)

	if (handlerArgs.length < 1
		&& (cmdName !== "reset"
			&& cmdName !== "users"
			&& cmdName !== "agg"
			&& cmdName !== "feeds"
			&& cmdName !== "following")) {
		console.log("You need to supply command argument(s)...")
		process.exit(1)
	}

	await registry[cmdName](cmdName, ...handlerArgs)

	process.exit(0)
}

main()
