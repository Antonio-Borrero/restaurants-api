import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import { prisma } from "../src/lib/prisma.ts";
import {
	cleanupDatabase,
	createAuthenticatedRestaurant,
	createCategory,
} from "./helpers.ts";

describe("POST /restaurant/:restaurantId/categories", () => {
	afterEach(cleanupDatabase);

	it("should create a new category", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);
		const restaurantId = restaurant.body.id;

		const response = await createCategory(token, restaurantId, [
			{
				locale: "en",
				name: "Test category",
			},
		]);

		expect(response.status).toBe(201);
		expect(response.body.translations[0].locale).toBe("en");
		expect(response.body.translations[0].name).toBe("Test category");
	});

	it("should show a 400 error for invalid fields", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);

		const restaurantId = restaurant.body.id;

		const response = await createCategory(token, restaurantId, []);

		expect(response.status).toBe(400);
		expect(response.body.error.code).toBe("VALIDATION_ERROR");
		expect(response.body.error.message).toBe("Invalid data");
	});

	it("should show a 403 error for not a member", async () => {
		const { token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);

		const response = await createCategory(token, 999999999, [
			{
				locale: "en",
				name: "Test category",
			},
		]);

		expect(response.status).toBe(403);
		expect(response.body.error.code).toBe("NOT_A_MEMBER");
		expect(response.body.error.message).toBe(
			"You do not have permission to this restaurant",
		);
	});
});

describe("DELETE /categories/:categoryId", () => {
	afterEach(cleanupDatabase);

	it("should show a 404 error for category not found", async () => {
		const { token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);

		const response = await request(app)
			.delete("/categories/99999999")
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.status).toBe(404);
		expect(response.body.error.code).toBe("CATEGORY_NOT_FOUND");
		expect(response.body.error.message).toBe("Category not found");
	});

	it("should show an 204 for successful deletion and a 404 for category not found", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);

		const restaurantId = restaurant.body.id;

		const category = await createCategory(token, restaurantId, [
			{
				locale: "en",
				name: "Test category",
			},
		]);

		const categoryId = category.body.id;

		const deletionResponse = await request(app)
			.delete(`/categories/${categoryId}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(deletionResponse.status).toBe(204);

		const response = await request(app)
			.delete(`/categories/${categoryId}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.status).toBe(404);
		expect(response.body.error.code).toBe("CATEGORY_NOT_FOUND");
		expect(response.body.error.message).toBe("Category not found");
	});

	it("should show a 409 error for conflict error", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);

		const restaurantId = restaurant.body.id;

		const category = await createCategory(token, restaurantId, [
			{
				locale: "en",
				name: "Test category",
			},
		]);

		const categoryId = category.body.id;

		const dish = await request(app)
			.post(`/categories/${categoryId}/dishes`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				originalName: "Μουσακάς",
				price: 12.5,
				allergens: ["gluten"],
				translations: [
					{
						locale: "en",
						name: "Moussaka",
						description: "Greek dish with eggplant and meat",
					},
				],
			});

		const response = await request(app)
			.delete(`/categories/${categoryId}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.status).toBe(409);
		expect(response.body.error.code).toBe("CATEGORY_HAS_CONTENT");
		expect(response.body.error.message).toBe(
			"This category has 1 dishes. Are you sure you want to delete it?",
		);
	});
});

describe("PATCH /categories/:categoryId", () => {
	afterEach(cleanupDatabase);

	it("should update a category with valid data", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);

		const restaurantId = restaurant.body.id;

		const category = await createCategory(token, restaurantId, [
			{
				locale: "en",
				name: "Test category",
			},
		]);

		const categoryId = category.body.id;

		const response = await request(app)
			.patch(`/categories/${categoryId}`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				translations: [
					{
						locale: "en",
						name: "Test category update",
					},
				],
			});

		const updatedTranslation = response.body.translations.find(
			(translation: { locale: string; name: string }) =>
				translation.locale === "en",
		);

		expect(response.status).toBe(200);
		expect(updatedTranslation.locale).toBe("en");
		expect(updatedTranslation.name).toBe("Test category update");
	});
});
