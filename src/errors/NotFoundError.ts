import { AppError } from "./AppError.ts";

export class NotFoundError extends AppError {
	constructor(code: string, message: string) {
		super(404, code, message);
	}
}
