import request from "supertest";
import app from "../src/app.ts";

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
