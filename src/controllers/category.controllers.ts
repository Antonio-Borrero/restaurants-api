import type { Request, Response } from "express";
import { findRestaurantByIdService } from "../services/restaurant.services.ts";
import {
	createCategoryService,
	deleteCategoryService,
	findCategoryByIdService,
	getCategoryService,
	updateCategoryService,
} from "../services/category.services.ts";
import {
	createCategorySchema,
	updateCategorySchema,
} from "../schemas/category.schemas.ts";
import { getMenuQuerySchema } from "../schemas/restaurant.schemas.ts";
import { formatCategory } from "../mappers/category.mappers.ts";
import { countDishesByCategoryService } from "../services/dish.service.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
import { ConflictError } from "../errors/ConflictError.ts";
import {
	CATEGORY_NOT_FOUND,
	RESTAURANT_NOT_FOUND,
} from "../errors/messages.ts";

export async function createCategoryController(req: Request, res: Response) {
	const restaurantId = Number(req.params.restaurantId);
	const { translations } = createCategorySchema.parse(req.body);

	const restaurant = await findRestaurantByIdService(restaurantId);
	if (!restaurant) {
		throw new NotFoundError(
			RESTAURANT_NOT_FOUND.code,
			RESTAURANT_NOT_FOUND.message,
		);
	}

	const category = await createCategoryService(restaurantId, translations);
	res.status(201).json(category);
}

export async function getCategoryController(req: Request, res: Response) {
	const categoryId = Number(req.params.categoryId);
	const { locale } = getMenuQuerySchema.parse(req.query);

	const category = await getCategoryService(categoryId, locale);
	if (!category) {
		throw new NotFoundError(
			CATEGORY_NOT_FOUND.code,
			CATEGORY_NOT_FOUND.message,
		);
	}

	return res.json(formatCategory(category));
}

export async function deleteCategoryController(req: Request, res: Response) {
	const categoryId = Number(req.params.categoryId);
	const confirm = req.query.confirm;

	const category = await findCategoryByIdService(categoryId);

	if (!category) {
		throw new NotFoundError(
			CATEGORY_NOT_FOUND.code,
			CATEGORY_NOT_FOUND.message,
		);
	}

	const dishes = await countDishesByCategoryService(categoryId);

	if (dishes > 0 && !confirm) {
		throw new ConflictError(
			"CATEGORY_HAS_CONTENT",
			`This category has ${dishes} dishes. Are you sure you want to delete it?`,
		);
	}

	await deleteCategoryService(categoryId);
	return res.status(204).send();
}

export async function updateCategoryController(req: Request, res: Response) {
	const categoryId = Number(req.params.categoryId);
	const { translations } = updateCategorySchema.parse(req.body);

	const category = await findCategoryByIdService(categoryId);

	if (!category) {
		throw new NotFoundError(
			CATEGORY_NOT_FOUND.code,
			CATEGORY_NOT_FOUND.message,
		);
	}

	const updatedCategory = await updateCategoryService(categoryId, translations);
	return res.status(200).json(updatedCategory);
}
