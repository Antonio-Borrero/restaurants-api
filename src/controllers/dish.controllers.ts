import type { Request, Response } from "express";
import { findCategoryByIdService } from "../services/category.services.ts";
import { createDishService } from "../services/dish.service.ts";
import { createDishSchema } from "../schemas/dish.schemas.ts";

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
