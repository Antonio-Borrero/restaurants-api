import { AppError } from "./AppError.ts";

export class ConflictError extends AppError {
	constructor(code: string, message: string) {
		super(409, code, message);
	}
}
