import { prisma } from "../lib/prisma.ts";

type DishTranslationInput = {
	locale: string;
	name: string;
	description?: string;
};

type CreateDishInput = {
	categoryId: number;
	price: number;
	allergens: string[];
	originalName?: string;
	translations: DishTranslationInput[];
};

type UpdateDishInput = {
	price?: number;
	allergens?: string[];
	originalName?: string;
	translations?: DishTranslationInput[];
};

export async function createDishService(data: CreateDishInput) {
	return await prisma.dish.create({
		data: {
			categoryId: data.categoryId,
			price: data.price,
			allergens: data.allergens,
			originalName: data.originalName,
			translations: {
				create: data.translations,
			},
		},
		include: { translations: true },
	});
}

export async function getDishService(dishId: number, locale: string) {
	return await prisma.dish.findUnique({
		where: { id: dishId },
		include: {
			translations: {
				where: { locale },
			},
		},
	});
}

export async function findDishByIdService(dishId: number) {
	return await prisma.dish.findUnique({
		where: { id: dishId },
	});
}

export async function deleteDishService(dishId: number) {
	return await prisma.dish.delete({
		where: { id: dishId },
	});
}

export async function countDishesByCategoryService(categoryId: number) {
	return await prisma.dish.count({
		where: { categoryId },
	});
}

export async function countDishesByRestaurantService(restaurantId: number) {
	return await prisma.dish.count({
		where: {
			category: { restaurantId },
		},
	});
}

export async function updateDishService(dishId: number, data: UpdateDishInput) {
	return await prisma.dish.update({
		where: { id: dishId },
		data: {
			price: data.price,
			allergens: data.allergens,
			originalName: data.originalName,
			translations: data.translations
				? {
						upsert: data.translations.map((translation) => ({
							where: { dishId_locale: { dishId, locale: translation.locale } },
							update: {
								name: translation.name,
								description: translation.description,
							},
							create: {
								locale: translation.locale,
								name: translation.name,
								description: translation.description,
							},
						})),
					}
				: undefined,
		},
		include: { translations: true },
	});
}
