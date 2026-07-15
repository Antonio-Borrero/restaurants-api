import type { Request, Response } from "express";
import {
	createRestaurantService,
	getRestaurantMenuService,
} from "../services/restaurant.services.ts";
import formatMenu from "../mappers/restaurant.mappers.ts";

export async function createRestaurantController(req: Request, res: Response) {
	const { name } = req.body;
	if (!name) {
		return res.status(400).json({ error: "Faltan datos obligatorios" });
	}
	if (typeof name !== "string") {
		return res
			.status(400)
			.json({ error: "Los datos deben ser de tipo string" });
	}
	try {
		const newRestaurant = await createRestaurantService(name);
		res.status(201).json(newRestaurant);
	} catch (error) {
		res.status(500).json({ error: "Error al crear el restaurante" });
	}
}

export async function getRestaurantMenuController(req: Request, res: Response) {
	const restaurantId = Number(req.params.restaurantId);
	const locale = req.query.locale;

	if (typeof locale !== "string" || locale.length === 0) {
		return res
			.status(400)
			.json({ error: "El parametro 'locale' es obligatorio" });
	}

	const restaurant = await getRestaurantMenuService(restaurantId, locale);

	if (!restaurant) {
		return res.status(404).json({ error: "Restaurante no encontrado" });
	}

	res.json(formatMenu(restaurant));
}
