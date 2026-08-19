import type { Prisma } from "../../generated/prisma/client.ts";
import { prisma } from "../lib/prisma.ts";

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

export async function getAllRestaurantsService(userId: number) {}
