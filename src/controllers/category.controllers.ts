import type { Request, Response } from "express";
import { findRestaurantByIdService } from "../services/restaurant.services.ts";
import {
	createCategoryService,
	deleteCategoryService,
	findCategoryByIdService,
	getCategoryService,
} from "../services/category.services.ts";
import { createCategorySchema } from "../schemas/category.schemas.ts";
import { getMenuQuerySchema } from "../schemas/restaurant.schemas.ts";
import { formatCategory } from "../mappers/category.mappers.ts";
import { countDishesByCategoryService } from "../services/dish.service.ts";

export async function createCategoryController(req: Request, res: Response) {
	const restaurantId = Number(req.params.restaurantId);
	const { translations } = createCategorySchema.parse(req.body);

	const restaurant = await findRestaurantByIdService(restaurantId);
	if (!restaurant) {
		return res.status(404).json({ error: "Restaurante no encontrado" });
	}

	const category = await createCategoryService(restaurantId, translations);
	res.status(201).json(category);
}

export async function getCategoryController(req: Request, res: Response) {
	const categoryId = Number(req.params.categoryId);
	const { locale } = getMenuQuerySchema.parse(req.query);

	const category = await getCategoryService(categoryId, locale);
	if (!category) {
		return res.status(404).json({ error: "Categoría no encontrada" });
	}

	return res.json(formatCategory(category));
}

export async function deleteCategoryController(req: Request, res: Response) {
	const categoryId = Number(req.params.categoryId);
	const confirm = req.query.confirm;

	const category = await findCategoryByIdService(categoryId);

	if (!category) {
		return res.status(404).json({ error: "Categoría no encontrada" });
	}

	const dishes = await countDishesByCategoryService(categoryId);

	if (dishes > 0 && !confirm) {
		return res.status(409).json({
			error: `Esta categoría tiene ${dishes} platos, ¿estás seguro de borrarla?`,
		});
	}

	await deleteCategoryService(categoryId);
	return res.status(204).send();
}
