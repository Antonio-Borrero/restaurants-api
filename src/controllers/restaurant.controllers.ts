import type { Request, Response } from "express";
import {
	createRestaurantService,
	getRestaurantMenuService,
} from "../services/restaurant.services.ts";
import { formatMenu } from "../mappers/restaurant.mappers.ts";
import {
	createRestaurantSchema,
	getMenuQuerySchema,
} from "../schemas/restaurant.schemas.ts";

export async function createRestaurantController(req: Request, res: Response) {
	const { name } = createRestaurantSchema.parse(req.body);
	const newRestaurant = await createRestaurantService(name);
	res.status(201).json(newRestaurant);
}

export async function getRestaurantMenuController(req: Request, res: Response) {
	const restaurantId = Number(req.params.restaurantId);
	const { locale } = getMenuQuerySchema.parse(req.query);

	const restaurant = await getRestaurantMenuService(restaurantId, locale);

	if (!restaurant) {
		return res.status(404).json({ error: "Restaurante no encontrado" });
	}

	res.json(formatMenu(restaurant));
}
