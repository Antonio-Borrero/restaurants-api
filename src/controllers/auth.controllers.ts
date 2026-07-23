import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schemas.ts";
import { loginService, registerService } from "../services/auth.services.ts";

export async function registerController(req: Request, res: Response) {
	const { email, password } = registerSchema.parse(req.body);

	const newUser = await registerService(email, password);
	res.status(201).json(newUser);
}

export async function loginController(req: Request, res: Response) {
	const { email, password } = loginSchema.parse(req.body);

	const loginUser = await loginService(email, password);
	res.status(200).json(loginUser);
}
