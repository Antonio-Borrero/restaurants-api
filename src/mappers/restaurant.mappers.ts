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

export default function formatMenu(restaurant: RestaurantMenu) {
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
