import type { NextFunction, Request, Response } from "express";
import { findCategoryByIdService } from "../services/category.services.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";

export async function attachRestaurantIdFromCategory(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const categoryId = Number(req.params.categoryId);

	const category = await findCategoryByIdService(categoryId);

	if (!category) {
		throw new NotFoundError("CATEGORY_NOT_FOUND", "Category not found");
	}

	req.params.restaurantId = String(category.restaurantId);
	next();
}
