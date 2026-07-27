import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import {
	cleanupDatabase,
	createAuthenticatedRestaurant,
	registerAndLogin,
} from "./helpers.ts";

describe("POST /restaurants/:restaurantId/members", () => {
	afterEach(cleanupDatabase);

	it("should create/invite a new member of a restaurant", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"TestName",
		);

		const restaurantId = restaurant.body.id;

		await registerAndLogin("2test@test.com", "2testPassword");

		const response = await request(app)
			.post(`/restaurants/${restaurantId}/members`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				email: "2test@test.com",
				role: "testRole",
			});

		expect(response.status).toBe(201);
		expect(response.body.role).toBe("testRole");
		expect(response.body.permissions).toEqual([]);
	});

	it("should show a 400 error for invalid data", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"TestName",
		);

		const restaurantId = restaurant.body.id;

		await registerAndLogin("2test@test.com", "2testPassword");

		const response = await request(app)
			.post(`/restaurants/${restaurantId}/members`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				email: "2test@test.com",
				role: "",
			});

		expect(response.status).toBe(400);
		expect(response.body.error.code).toBe("VALIDATION_ERROR");
		expect(response.body.error.message).toBe("Invalid data");
	});

	it("should show a 403 error for not a member", async () => {
		const { token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"TestName",
		);

		await registerAndLogin("2test@test.com", "2testPassword");

		const response = await request(app)
			.post(`/restaurants/9999999/members`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				email: "2test@test.com",
				role: "testRole",
			});

		expect(response.status).toBe(403);
		expect(response.body.error.code).toBe("NOT_A_MEMBER");
		expect(response.body.error.message).toBe(
			"You do not have permission to this restaurant",
		);
	});
});

describe("PATCH /members/:memberId/permissions", () => {
	afterEach(cleanupDatabase);

	it("should grant permissions to a member", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"TestName",
		);

		const restaurantId = restaurant.body.id;

		await registerAndLogin("2test@test.com", "2testPassword");

		const secondUserMembership = await request(app)
			.post(`/restaurants/${restaurantId}/members`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				email: "2test@test.com",
				role: "testRole",
			});

		const secondUserId = secondUserMembership.body.id;

		const response = await request(app)
			.patch(`/members/${secondUserId}/permissions`)
			.set("Authorization", `Bearer ${token}`)
			.send({ permissions: ["MANAGE_MENU", "MANAGE_MEMBERS"] });

		expect(response.status).toBe(200);
		expect(response.body.permissions).toEqual([
			"MANAGE_MENU",
			"MANAGE_MEMBERS",
		]);
	});

	it("should show a 404 for member not found", async () => {
		const { token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"TestName",
		);

		const response = await request(app)
			.patch(`/members/999999/permissions`)
			.set("Authorization", `Bearer ${token}`)
			.send({ permissions: ["MANAGE_MENU", "MANAGE_MEMBERS"] });

		expect(response.status).toBe(404);
		expect(response.body.error.code).toBe("MEMBER_NOT_FOUND");
		expect(response.body.error.message).toBe("Member not found");
	});
});

describe("DELETE /members/:memberId", () => {
	afterEach(cleanupDatabase);

	it("should show a 204 for successful deletion and a 404 for member not found", async () => {
		const { restaurant, token } = await createAuthenticatedRestaurant(
			"test@test.com",
			"testPassword",
			"TestName",
		);

		const restaurantId = restaurant.body.id;

		await registerAndLogin("2test@test.com", "2testPassword");

		const secondUserMembership = await request(app)
			.post(`/restaurants/${restaurantId}/members`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				email: "2test@test.com",
				role: "testRole",
			});

		const secondUserId = secondUserMembership.body.id;

		const deletionResponse = await request(app)
			.delete(`/members/${secondUserId}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(deletionResponse.status).toBe(204);

		const response = await request(app)
			.delete(`/members/${secondUserId}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.status).toBe(404);
		expect(response.body.error.code).toBe("MEMBER_NOT_FOUND");
		expect(response.body.error.message).toBe("Member not found");
	});
});
