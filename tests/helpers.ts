import request from "supertest";
import app from "../src/app.ts";
import { prisma } from "../src/lib/prisma.ts";

export async function registerAndLogin(email: string, password: string) {
	const register = await request(app).post("/auth/register").send({
		email,
		password,
	});

	const login = await request(app).post("/auth/login").send({
		email,
		password,
	});

	return login.body.token;
}

export async function createAuthenticatedRestaurant(
	email: string,
	password: string,
	name: string,
) {
	const token = await registerAndLogin(email, password);

	const restaurant = await request(app)
		.post("/restaurants")
		.set("authorization", `Bearer ${token}`)
		.send({ name });
	return { restaurant, token };
}

export async function cleanupDatabase() {
	await prisma.user.deleteMany();
	await prisma.restaurant.deleteMany();
}

export async function createCategory(
	token: string,
	restaurantId: number,
	translations: { locale: string; name: string }[],
) {
	return request(app)
		.post(`/restaurants/${restaurantId}/categories`)
		.set("Authorization", `Bearer ${token}`)
		.send({ translations });
}

export async function createDish(
	token: string,
	categoryId: number,
	data: object,
) {
	return request(app)
		.post(`/categories/${categoryId}/dishes`)
		.set("Authorization", `Bearer ${token}`)
		.send(data);
}
