import type { NextFunction, Request, Response } from "express";
import { findDishByIdService } from "../services/dish.service.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import { findCategoryByIdService } from "../services/category.services.ts";

export async function attachRestaurantIdFromDish(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const dishId = Number(req.params.dishId);

	const dish = await findDishByIdService(dishId);

	if (!dish) {
		throw new NotFoundError("DISH_NOT_FOUND", "Dish not found");
	}

	const categoryId = dish.categoryId;

	const category = await findCategoryByIdService(categoryId);

	if (!category) {
		throw new NotFoundError("CATEGORY_NOT_FOUND", "Category not found");
	}

	req.params.restaurantId = String(category.restaurantId);
	next();
}
