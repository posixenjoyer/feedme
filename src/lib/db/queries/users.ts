
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export async function createUser(name: string) {
	const [result] = await db.insert(users).values({ name: name }).returning();
	return result
}

export async function getUser(name: string) {
	const result = await db.select().from(users).where(eq(users.name, name));

	return result
}

export async function resetUsers() {
	console.log("calling db.delete(users)")
	const count = await db.delete(users).returning()

	return count
}

export async function getUsers() {
	const results = await db.select().from(users)

	return results
}
