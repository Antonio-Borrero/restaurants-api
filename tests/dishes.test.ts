import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import {
	cleanupDatabase,
	createAuthenticatedRestaurant,
	createCategory,
	createDish,
	registerAndLogin,
} from "./helpers.ts";

describe("POST /restaurants/:restaurantId/categories/:categoryId/dishes", () => {
	afterEach(cleanupDatabase);

	it("should create a new dish", async () => {
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

		const response = await createDish(token, categoryId, {
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

		const response = await createDish(token, categoryId, {
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
		const { token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"testName",
		);

		const response = await createDish(token, 999999, {
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

	it("should show a 403 error for not a member", async () => {
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

		const otherUser = await registerAndLogin("2test@test.com", "2testPassword");

		const response = await createDish(otherUser, categoryId, {
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

		expect(response.status).toBe(403);
		expect(response.body.error.code).toBe("NOT_A_MEMBER");
		expect(response.body.error.message).toBe(
			"You do not have permission to this restaurant",
		);
	});
});

describe("PATCH /dishes/:dishId", () => {
	afterEach(cleanupDatabase);

	it("should update a dish", async () => {
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

		const dish = await createDish(token, categoryId, {
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

		const dishId = dish.body.id;

		const response = await request(app)
			.patch(`/dishes/${dishId}`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				price: 15,
				allergens: ["gluten"],
				translations: [
					{
						locale: "en",
						name: "Updated test dish",
						description: "Updated test description",
					},
				],
			});

		const updatedTranslation = response.body.translations.find(
			(translation: { locale: string; name: string; description: string }) =>
				translation.locale === "en",
		);

		expect(response.status).toBe(200);
		expect(response.body.price).toBe("15");
		expect(response.body.allergens).toEqual(["gluten"]);
		expect(response.body.originalName).toBe(null);
		expect(updatedTranslation.locale).toBe("en");
		expect(updatedTranslation.name).toBe("Updated test dish");
		expect(updatedTranslation.description).toBe("Updated test description");
	});
});

describe("DELETE /dishes/:dishId", () => {
	afterEach(cleanupDatabase);

	it("should show an 204 for successful deletion and a 404 for dish not found", async () => {
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

		const dish = await createDish(token, categoryId, {
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

		const dishId = dish.body.id;

		const deletionResponse = await request(app)
			.delete(`/dishes/${dishId}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(deletionResponse.status).toBe(204);

		const response = await request(app)
			.delete(`/dishes/${dishId}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.status).toBe(404);
		expect(response.body.error.code).toBe("DISH_NOT_FOUND");
		expect(response.body.error.message).toBe("Dish not found");
	});
});
