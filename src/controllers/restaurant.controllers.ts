import type { Request, Response } from "express";
import {
	createRestaurantService,
	deleteRestaurantService,
	findRestaurantByIdService,
	getRestaurantMenuService,
	updateRestaurantService,
} from "../services/restaurant.services.ts";
import { formatMenu } from "../mappers/restaurant.mappers.ts";
import {
	createRestaurantSchema,
	getMenuQuerySchema,
	updateRestaurantSchema,
} from "../schemas/restaurant.schemas.ts";
import { countCategoriesByRestaurantService } from "../services/category.services.ts";
import { countDishesByRestaurantService } from "../services/dish.service.ts";

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

export async function deleteRestaurantController(req: Request, res: Response) {
	const restaurantId = Number(req.params.restaurantId);
	const confirm = req.query.confirm;

	const restaurant = await findRestaurantByIdService(restaurantId);

	if (!restaurant) {
		return res.status(404).json({ error: "Restaurante no encontrado" });
	}

	const categories = await countCategoriesByRestaurantService(restaurantId);
	const dishes = await countDishesByRestaurantService(restaurantId);

	if (categories > 0 && !confirm) {
		return res.status(409).json({
			error: `Este local tiene ${categories} categorías y ${dishes} platos, ¿estás seguro de borrarlo?`,
		});
	}

	await deleteRestaurantService(restaurantId);
	return res.status(204).send();
}

export async function updateRestaurantController(req: Request, res: Response) {
	const data = updateRestaurantSchema.parse(req.body);
	const restaurantId = Number(req.params.restaurantId);

	const restaurant = await findRestaurantByIdService(restaurantId);

	if (!restaurant) {
		return res
			.status(404)
			.json({ error: "No se ha encontrado un restaurante con ese id" });
	}

	const updatedRestaurant = await updateRestaurantService(restaurantId, data);
	return res.status(200).json(updatedRestaurant);
}
