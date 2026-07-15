import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
	error: unknown,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	console.error(error);

	if (error instanceof ZodError) {
		return res.status(400).json({
			error: "Datos invalidos",
			details: error.issues.map((issue) => ({
				campo: issue.path.join("."),
				mensaje: issue.message,
			})),
		});
	}

	res.status(500).json({ error: "Error interno del servidor" });
}
