import type { Request, Response } from "express";
import { findCategoryByIdService } from "../services/category.services.ts";
import { createDishService } from "../services/dish.service.ts";

export async function createDishController(req: Request, res: Response) {
	const categoryId = Number(req.params.categoryId);
	const price = Number(req.body.price);
	const allergens = req.body.allergens ?? [];
	const originalName = req.body.originalName;
	const { translations } = req.body;

	if (isNaN(price) || price <= 0) {
		return res
			.status(400)
			.json({ error: "El precio debe ser un número positivo" });
	}

	if (!Array.isArray(translations) || translations.length === 0) {
		return res
			.status(400)
			.json({ error: "Se requiere al menos una traducción" });
	}

	const category = await findCategoryByIdService(categoryId);

	if (!category) {
		return res.status(404).json({ error: "Categoría no encontrada" });
	}

	try {
		const dish = await createDishService({
			categoryId,
			price,
			allergens,
			originalName,
			translations,
		});
		res.status(201).json(dish);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al crear el plato" });
	}
}
