import { prisma } from "../lib/prisma.ts";

export async function createDishService(data: {
	categoryId: number;
	price: number;
	allergens: string[];
	originalName?: string;
	translations: {
		locale: string;
		name: string;
		description?: string;
	}[];
}) {
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
