import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError.ts";

export function errorHandler(
	error: unknown,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	console.error(error);

	if (error instanceof ZodError) {
		return res.status(400).json({
			error: {
				code: "VALIDATION_ERROR",
				message: "Invalid data",
				details: error.issues.map((issue) => ({
					field: issue.path.join("."),
					message: issue.message,
				})),
			},
		});
	}

	if (error instanceof AppError) {
		return res.status(error.statusCode).json({
			error: {
				code: error.code,
				message: error.message,
			},
		});
	}

	res.status(500).json({
		error: {
			code: "INTERNAL_SERVER_ERROR",
			message: "Internal server error",
		},
	});
}
