import { AppError } from "./AppError.ts";

export class ForbiddenError extends AppError {
	constructor(code: string, message: string) {
		super(403, code, message);
	}
}
