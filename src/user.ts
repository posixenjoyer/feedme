import { getUser } from "./lib/db/queries/users"
import type { users } from "./lib/db/schema"

export type User = typeof users.$inferSelect

export async function getUserObjFromName(name: string) {
	const userData = await getUser(name)

	const user: User = {
		id: userData["id"],
		name: userData["name"],
		createdAt: userData["createdAt"],
		updatedAt: userData["updatedAt"]
	}

	return user
}
