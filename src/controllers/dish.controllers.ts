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

export async function createDishController(req: Request, res: Response) {
	const categoryId = Number(req.params.categoryId);
	const { price, allergens, originalName, translations } =
		createDishSchema.parse(req.body);

	const category = await findCategoryByIdService(categoryId);

	if (!category) {
		return res.status(404).json({ error: "Categoría no encontrada" });
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
		return res.status(404).json({ error: "Plato no encontrado" });
	}

	return res.json(formatDish(dish));
}

export async function deleteDishController(req: Request, res: Response) {
	const dishId = Number(req.params.dishId);

	const dish = await findDishByIdService(dishId);

	if (!dish) {
		return res.status(404).json({ error: "Plato no encontrado" });
	}

	await deleteDishService(dishId);

	return res.status(204).send();
}

export async function updateDishController(req: Request, res: Response) {
	const dishId = Number(req.params.dishId);
	const data = updateDishSchema.parse(req.body);

	const dish = await findDishByIdService(dishId);

	if (!dish) {
		return res.status(404).json({ error: "Plato no encontrado" });
	}

	const updatedDish = await updateDishService(dishId, data);
	return res.status(200).json(updatedDish);
}
