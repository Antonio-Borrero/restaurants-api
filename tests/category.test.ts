import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import { prisma } from "../src/lib/prisma.ts";

describe("POST /restaurant/:restaurantId/categories", () => {
	afterEach(async () => {
		await prisma.restaurant.deleteMany();
	});

	it("should create a new category", async () => {
		const restaurant = await request(app)
			.post("/restaurants")
			.send({ name: "Test restaurant" });
		const id = restaurant.body.id;

		const response = await request(app)
			.post(`/restaurants/${id}/categories`)
			.send({
				translations: [
					{
						locale: "en",
						name: "Test category",
					},
				],
			});

		expect(response.status).toBe(201);
		expect(response.body.translations[0].locale).toBe("en");
		expect(response.body.translations[0].name).toBe("Test category");
	});

	it("should show a 400 error for invalid fields", async () => {
		const response = await request(app)
			.post("/restaurants/999999999/categories")
			.send({ translations: [] });

		expect(response.status).toBe(400);
		expect(response.body.error.code).toBe("VALIDATION_ERROR");
		expect(response.body.error.message).toBe("Invalid data");
	});

	it("should show a 404 error for restaurant not found", async () => {
		const response = await request(app)
			.post("/restaurants/99999999/categories")
			.send({
				translations: [
					{
						locale: "en",
						name: "Test category",
					},
				],
			});

		expect(response.status).toBe(404);
		expect(response.body.error.code).toBe("RESTAURANT_NOT_FOUND");
		expect(response.body.error.message).toBe("Restaurant not found");
	});
});

describe("DELETE /categories/:categoryId", () => {
	it("should show a 404 error for category not found", async () => {
		const response = await request(app).delete("/categories/99999999").send();

		expect(response.status).toBe(404);
		expect(response.body.error.code).toBe("CATEGORY_NOT_FOUND");
		expect(response.body.error.message).toBe("Category not found");
	});
});
