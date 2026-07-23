import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError.ts";
import jwt from "jsonwebtoken";

export function authenticate(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		throw new UnauthorizedError(
			"MISSING_TOKEN",
			"Authentication token is required",
		);
	}

	const token = authHeader.split(" ")[1];

	let decoded;
	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET!);
	} catch {
		throw new UnauthorizedError("INVALID_TOKEN", "Invalid or expired token");
	}

	const { userId } = decoded as { userId: number };
	req.userId = userId;
	next();
}
