import type { Request, Response } from "express";
import { findRestaurantByIdService } from "../services/restaurant.services.ts";
import {
	createCategoryService,
	getCategoryService,
} from "../services/category.services.ts";
import { createCategorySchema } from "../schemas/category.schemas.ts";
import { getMenuQuerySchema } from "../schemas/restaurant.schemas.ts";
import { formatCategory } from "../mappers/category.mappers.ts";

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
