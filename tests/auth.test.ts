import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { cleanupDatabase } from "./helpers.ts";
import app from "../src/app.ts";

describe("POST /auth/register", () => {
	afterEach(cleanupDatabase);

	it("should register successfully", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "test@test.com",
			password: "testPassword",
		});

		expect(response.status).toBe(201);
		expect(response.body.email).toBe("test@test.com");
		expect(response.body.password).toBeUndefined();
	});

	it("should show a 400 error for invalid fields", async () => {
		const response = await request(app).post("/auth/register").send({
			email: "testEmail",
			password: "",
		});

		expect(response.status).toBe(400);
		expect(response.body.error.code).toBe("VALIDATION_ERROR");
		expect(response.body.error.message).toBe("Invalid data");
	});

	it("should show a 409 for email already in use", async () => {
		const emailInUse = await request(app).post("/auth/register").send({
			email: "test@test.com",
			password: "testPassword",
		});

		const response = await request(app).post("/auth/register").send({
			email: "test@test.com",
			password: "testPassword",
		});

		expect(response.status).toBe(409);
		expect(response.body.error.code).toBe("EMAIL_ALREADY_USED");
		expect(response.body.error.message).toBe("Email already in use");
	});
});

describe("POST /auth/login", () => {
	afterEach(cleanupDatabase);

	it("should login successfully", async () => {
		const register = await request(app).post("/auth/register").send({
			email: "test@test.com",
			password: "testPassword",
		});

		const response = await request(app).post("/auth/login").send({
			email: "test@test.com",
			password: "testPassword",
		});

		expect(response.status).toBe(200);
		expect(response.body.user.email).toBe("test@test.com");
		expect(response.body.user.password).toBeUndefined();
	});

	it("should show a 401 error for wrong password", async () => {
		const register = await request(app).post("/auth/register").send({
			email: "test@test.com",
			password: "testPassword",
		});

		const response = await request(app).post("/auth/login").send({
			email: "test@test.com",
			password: "wrongPassword",
		});

		console.log(response.status, response.body);
		expect(response.status).toBe(401);
		expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
		expect(response.body.error.message).toBe("Invalid credentials");
	});

	it("should show a 401 error for wrong email", async () => {
		const register = await request(app).post("/auth/register").send({
			email: "test@test.com",
			password: "testPassword",
		});

		const response = await request(app).post("/auth/login").send({
			email: "wrongEmail@test.com",
			password: "testPassword",
		});

		expect(response.status).toBe(401);
		expect(response.body.error.code).toBe("INVALID_CREDENTIALS");
		expect(response.body.error.message).toBe("Invalid credentials");
	});
});
