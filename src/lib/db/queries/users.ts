
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

export async function getUserId(name: string) {
	const result = await db.select().from(users).where(eq(users.name, name));
	if (!result[0]["id"]) {
		throw Error(`User not found: ${name}!`);
	}
	return result[0]["id"]
}

export async function getUsernameFromId(id: string) {
	const result = await db.select().from(users).where(eq(users.id, id))
	if (!result[0]["name"]) {
		throw Error(`User not found for ID: ${id}`)
	}
	return result[0]["name"]
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
