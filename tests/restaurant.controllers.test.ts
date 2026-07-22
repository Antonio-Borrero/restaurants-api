import { describe, it, expect, afterEach } from "vitest";
import request from "supertest";
import app from "../src/app.ts";
import { prisma } from "../src/lib/prisma.ts";

describe("POST /restaurants", () => {
	afterEach(async () => {
		await prisma.restaurant.deleteMany();
	});

	it("should create a new restaurant with valid data", async () => {
		const response = await request(app)
			.post("/restaurants")
			.send({ name: "Test restaurant" });

		expect(response.status).toBe(201);
		expect(response.body.name).toBe("Test restaurant");
	});

	it("should show an 400 error for invalid fields", async () => {
		const response = await request(app).post("/restaurants").send({ name: "" });

		expect(response.status).toBe(400);
		expect(response.body.error.code).toBe("VALIDATION_ERROR");
		expect(response.body.error.message).toBe("Invalid data");
	});
});

describe("DELETE /restaurants", () => {
	it("should show an 404 error for not found", async () => {
		const response = await request(app).delete("/restaurants/99999999").send();

		expect(response.status).toBe(404);
		expect(response.body.error.code).toBe("RESTAURANT_NOT_FOUND");
		expect(response.body.error.message).toBe("Restaurant not found");
	});
});
