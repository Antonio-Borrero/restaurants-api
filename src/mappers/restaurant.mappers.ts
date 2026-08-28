import type { Prisma } from "../../generated/prisma/client.ts";

type RestaurantMenu = Prisma.RestaurantGetPayload<{
	include: {
		categories: {
			include: {
				translations: true;
				dishes: {
					include: {
						translations: true;
					};
				};
			};
		};
	};
}>;

type RestaurantWithCounts = Prisma.RestaurantGetPayload<{
	include: {
		_count: {
			select: {
				categories: true;
			};
		};
		members: {
			select: {
				role: true;
				permissions: true;
			};
		};
	};
}> & { dishCount: number };

export function formatMenu(restaurant: RestaurantMenu) {
	return {
		id: restaurant.id,
		name: restaurant.name,
		categories: restaurant.categories.map((category) => ({
			id: category.id,
			name: category.translations[0]?.name ?? null,
			dishes: category.dishes.map((dish) => ({
				id: dish.id,
				name: dish.translations[0]?.name ?? null,
				description: dish.translations[0]?.description ?? null,
				originalName: dish.originalName,
				price: dish.price,
				allergens: dish.allergens,
			})),
		})),
	};
}

export function formatRestaurant(restaurant: RestaurantWithCounts) {
	return {
		id: restaurant.id,
		name: restaurant.name,
		address: restaurant.address,
		telephone: restaurant.telephone,
		email: restaurant.email,
		cuisineType: restaurant.cuisineType,
		description: restaurant.description,
		imageUrl: restaurant.imageUrl,
		createdAt: restaurant.createdAt,
		updatedAt: restaurant.updatedAt,
		categoryCount: restaurant._count.categories,
		role: restaurant.members[0].role,
		permissions: restaurant.members[0].permissions,
		dishCount: restaurant.dishCount,
	};
}
