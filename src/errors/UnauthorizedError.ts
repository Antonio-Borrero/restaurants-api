import { AppError } from "./AppError.ts";

export class UnauthorizedError extends AppError {
	constructor(code: string, message: string) {
		super(401, code, message);
	}
}
