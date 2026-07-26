import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import { prisma } from "../src/lib/prisma.ts";
import { createAuthenticatedRestaurant, registerAndLogin } from "./helpers.ts";

describe("POST /restaurants", () => {
	afterEach(async () => {
		await prisma.user.deleteMany();
		await prisma.restaurant.deleteMany();
	});

	it("should create a new restaurant with valid data", async () => {
		const response = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);

		expect(response.restaurant.status).toBe(201);
		expect(response.restaurant.body.name).toBe("testName");
	});

	it("should show an 400 error for invalid fields", async () => {
		const token = await registerAndLogin("test2@test.com", "testPassword");

		const response = await request(app)
			.post("/restaurants")
			.set("Authorization", `Bearer ${token}`)
			.send({ name: "" });

		expect(response.status).toBe(400);
		expect(response.body.error.code).toBe("VALIDATION_ERROR");
		expect(response.body.error.message).toBe("Invalid data");
	});
});

describe("DELETE /restaurants", () => {
	it("should show an 403 error for not authorized", async () => {
		const { token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);
		const response = await request(app)
			.delete("/restaurants/99999999")
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.status).toBe(403);
		expect(response.body.error.code).toBe("NOT_A_MEMBER");
		expect(response.body.error.message).toBe(
			"You do not have permission to this restaurant",
		);
	});

	it("should show an 204 for successful deletion and a 403 for not a member", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);

		const deletionResponse = await request(app)
			.delete(`/restaurants/${restaurant.body.id}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(deletionResponse.status).toBe(204);

		const response = await request(app)
			.delete(`/restaurants/${restaurant.body.id}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.status).toBe(403);
		expect(response.body.error.code).toBe("NOT_A_MEMBER");
		expect(response.body.error.message).toBe(
			"You do not have permission to this restaurant",
		);
	});

	it("should show a 409 error for restaurant has content", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);

		const category = await request(app)
			.post(`/restaurants/${restaurant.body.id}/categories`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				translations: [
					{
						locale: "en",
						name: "Test category",
					},
				],
			});

		const response = await request(app)
			.delete(`/restaurants/${restaurant.body.id}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.status).toBe(409);
		expect(response.body.error.code).toBe("RESTAURANT_HAS_CONTENT");
		expect(response.body.error.message).toBe(
			`This restaurant has 1 categories and 0 dishes. Are you sure you want to delete it?`,
		);
	});
});

describe("PATCH /restaurants", () => {
	afterEach(async () => {
		await prisma.restaurant.deleteMany();
	});

	it("should update a restaurant's data", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);
		const response = await request(app)
			.patch(`/restaurants/${restaurant.body.id}`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				name: "updatedTestName",
			});

		expect(response.status).toBe(200);
		expect(response.body.name).toBe("updatedTestName");
	});
});
