import type { Request, Response } from "express";
import { findRestaurantByIdService } from "../services/restaurant.services.ts";
import { createCategoryService } from "../services/category.services.ts";

export async function createCategoryController(req: Request, res: Response) {
	const restaurantId = Number(req.params.id);
	const { translations } = req.body;

	if (!Array.isArray(translations) || translations.length === 0) {
		return res
			.status(400)
			.json({ error: "Se requiere al menos una traducción" });
	}

	const restaurant = await findRestaurantByIdService(restaurantId);

	if (!restaurant) {
		return res.status(404).json({ error: "Restaurante no encontrado" });
	}

	try {
		const category = await createCategoryService(restaurantId, translations);
		res.status(201).json(category);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error al crear la categoría" });
	}
}
