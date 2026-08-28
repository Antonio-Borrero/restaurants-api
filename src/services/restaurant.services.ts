import type { Prisma } from "../../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";
import { countDishesByRestaurantService } from "./dish.service.ts";

type CreateRestaurantInput = {
	name: string;
	address?: string;
	telephone?: string;
	email?: string;
	cuisineType?: string;
	description?: string;
	imageUrl?: string;
};

export async function createRestaurantService(
	restaurant: CreateRestaurantInput,
	userId: number,
) {
	return await prisma.restaurant.create({
		data: {
			...restaurant,
			members: {
				create: {
					userId,
					role: "Owner",
					permissions: [
						"MANAGE_MENU",
						"EDIT_RESTAURANT",
						"DELETE_RESTAURANT",
						"MANAGE_MEMBERS",
						"MANAGE_PERMISSIONS",
					],
				},
			},
		},
	});
}

export async function findRestaurantByIdService(id: number) {
	return await prisma.restaurant.findUnique({
		where: { id },
	});
}

export async function getRestaurantMenuService(
	restaurantId: number,
	locale: string,
) {
	return await prisma.restaurant.findUnique({
		where: { id: restaurantId },
		include: {
			categories: {
				include: {
					translations: { where: { locale } },
					dishes: {
						include: {
							translations: { where: { locale } },
						},
					},
				},
			},
		},
	});
}

export async function deleteRestaurantService(restaurantId: number) {
	return await prisma.restaurant.delete({
		where: { id: restaurantId },
	});
}

export async function updateRestaurantService(
	restaurantId: number,
	data: Prisma.RestaurantUpdateInput,
) {
	return await prisma.restaurant.update({
		where: { id: restaurantId },
		data,
	});
}

export async function getRestaurantsByUserService(userId: number) {
	const restaurants = await prisma.restaurant.findMany({
		where: {
			members: {
				some: { userId },
			},
		},
		include: {
			_count: {
				select: { categories: true },
			},
			members: {
				where: { userId: userId },
				select: { role: true, permissions: true },
			},
		},
	});

	const restaurantsData = restaurants.map(async (restaurant) => {
		const dishes = await countDishesByRestaurantService(restaurant.id);
		return { ...restaurant, dishCount: dishes };
	});

	return await Promise.all(restaurantsData);
}
