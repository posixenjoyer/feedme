import dotenv from 'dotenv';
import { readConfig, setUser } from "./config";
import * as Handlers from "./handlers";
import { drizzle } from "drizzle-orm/postgres-js";


async function main() {
	const registry: Handlers.CommandRegistry = new Map()

	dotenv.config()
	console.log(`Connect: ${process.env.DB_URL}`)

	Handlers.registerCommand(registry, "login", Handlers.handlerLogin)
	Handlers.registerCommand(registry, "register", Handlers.handlerRegister)

	const cmdName = process.argv[2]
	const handlerArgs = process.argv.slice(3)

	if (handlerArgs.length < 1) {
		console.log("You need to supply command argument(s)...")
		process.exit(1)
	}

	await registry[cmdName](cmdName, handlerArgs[0])

	const dbConfig = readConfig()
	console.log(dbConfig)

	process.exit(0)
}

main()
