import type { Request, Response } from "express";
import { findCategoryByIdService } from "../services/category.services.ts";
import {
	createDishService,
	deleteDishService,
	findDishByIdService,
	getDishService,
	updateDishService,
} from "../services/dish.service.ts";
import { createDishSchema, updateDishSchema } from "../schemas/dish.schemas.ts";
import { getMenuQuerySchema } from "../schemas/restaurant.schemas.ts";
import { formatDish } from "../mappers/dish.mappers.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import { CATEGORY_NOT_FOUND, DISH_NOT_FOUND } from "../errors/messages.ts";

export async function createDishController(req: Request, res: Response) {
	const categoryId = Number(req.params.categoryId);
	const { price, allergens, originalName, translations } =
		createDishSchema.parse(req.body);

	const category = await findCategoryByIdService(categoryId);

	if (!category) {
		throw new NotFoundError(
			CATEGORY_NOT_FOUND.code,
			CATEGORY_NOT_FOUND.message,
		);
	}

	const dish = await createDishService({
		categoryId,
		price,
		allergens: allergens ?? [],
		originalName,
		translations,
	});
	res.status(201).json(dish);
}

export async function getDishController(req: Request, res: Response) {
	const dishId = Number(req.params.dishId);
	const { locale } = getMenuQuerySchema.parse(req.query);

	const dish = await getDishService(dishId, locale);

	if (!dish) {
		throw new NotFoundError(DISH_NOT_FOUND.code, DISH_NOT_FOUND.message);
	}

	return res.json(formatDish(dish));
}

export async function deleteDishController(req: Request, res: Response) {
	const dishId = Number(req.params.dishId);

	const dish = await findDishByIdService(dishId);

	if (!dish) {
		throw new NotFoundError(DISH_NOT_FOUND.code, DISH_NOT_FOUND.message);
	}

	await deleteDishService(dishId);

	return res.status(204).send();
}

export async function updateDishController(req: Request, res: Response) {
	const dishId = Number(req.params.dishId);
	const data = updateDishSchema.parse(req.body);

	const dish = await findDishByIdService(dishId);

	if (!dish) {
		throw new NotFoundError(DISH_NOT_FOUND.code, DISH_NOT_FOUND.message);
	}

	const updatedDish = await updateDishService(dishId, data);
	return res.status(200).json(updatedDish);
}
