import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "../src/lib/prisma.ts";
import request from "supertest";
import app from "../src/app.ts";

describe("POST /restaurants/:restaurantId/categories/:categoryId/dishes", () => {
	afterEach(async () => {
		await prisma.restaurant.deleteMany();
	});

	it("should create a new dish", async () => {
		const restaurant = await request(app)
			.post("/restaurants")
			.send({ name: "Test restaurant" });
		const restaurantId = restaurant.body.id;

		const category = await request(app)
			.post(`/restaurants/${restaurantId}/categories`)
			.send({
				translations: [
					{
						locale: "en",
						name: "Test category",
					},
				],
			});
		const categoryId = category.body.id;

		const response = await request(app)
			.post(`/categories/${categoryId}/dishes`)
			.send({
				price: 10,
				allergens: ["lactose"],
				translations: [
					{
						locale: "en",
						name: "Test dish",
						description: "Test description",
					},
				],
			});

		expect(response.status).toBe(201);
		expect(response.body.price).toBe("10");
		expect(response.body.allergens).toEqual(["lactose"]);
		expect(response.body.originalName).toBe(null);
		expect(response.body.translations[0].locale).toBe("en");
		expect(response.body.translations[0].name).toBe("Test dish");
		expect(response.body.translations[0].description).toBe("Test description");
	});

	it("should show a 400 error for invalid fields", async () => {
		const response = await request(app)
			.post("/categories/99999999/dishes")
			.send({
				price: "10",
				allergens: ["l"],
				translations: [
					{
						locale: "",
						name: "Test dish",
						description: "Test description",
					},
				],
			});

		expect(response.status).toBe(400);
		expect(response.body.error.code).toBe("VALIDATION_ERROR");
		expect(response.body.error.message).toBe("Invalid data");
	});

	it("should show a 404 error for category not found", async () => {
		const response = await request(app)
			.post("/categories/99999999/dishes")
			.send({
				price: 10,
				allergens: ["lactose"],
				translations: [
					{
						locale: "en",
						name: "Test dish",
						description: "Test description",
					},
				],
			});

		expect(response.status).toBe(404);
		expect(response.body.error.code).toBe("CATEGORY_NOT_FOUND");
		expect(response.body.error.message).toBe("Category not found");
	});
});
