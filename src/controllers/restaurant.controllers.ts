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
import { NotFoundError } from "../errors/NotFoundError.ts";
import { ConflictError } from "../errors/ConflictError.ts";
import { RESTAURANT_NOT_FOUND } from "../errors/messages.ts";

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
		throw new NotFoundError(
			RESTAURANT_NOT_FOUND.code,
			RESTAURANT_NOT_FOUND.message,
		);
	}

	res.json(formatMenu(restaurant));
}

export async function deleteRestaurantController(req: Request, res: Response) {
	const restaurantId = Number(req.params.restaurantId);
	const confirm = req.query.confirm;

	const restaurant = await findRestaurantByIdService(restaurantId);

	if (!restaurant) {
		throw new NotFoundError(
			RESTAURANT_NOT_FOUND.code,
			RESTAURANT_NOT_FOUND.message,
		);
	}

	const categories = await countCategoriesByRestaurantService(restaurantId);
	const dishes = await countDishesByRestaurantService(restaurantId);

	if (categories > 0 && !confirm) {
		throw new ConflictError(
			"RESTAURANT_HAS_CONTENT",
			`This restaurant has ${categories} categories and ${dishes} dishes. Are you sure you want to delete it?`,
		);
	}

	await deleteRestaurantService(restaurantId);
	return res.status(204).send();
}

export async function updateRestaurantController(req: Request, res: Response) {
	const data = updateRestaurantSchema.parse(req.body);
	const restaurantId = Number(req.params.restaurantId);

	const restaurant = await findRestaurantByIdService(restaurantId);

	if (!restaurant) {
		throw new NotFoundError(
			RESTAURANT_NOT_FOUND.code,
			RESTAURANT_NOT_FOUND.message,
		);
	}

	const updatedRestaurant = await updateRestaurantService(restaurantId, data);
	return res.status(200).json(updatedRestaurant);
}
