import type { Prisma } from "../../generated/prisma/client.ts";

type DishWithTranslations = Prisma.DishGetPayload<{
	include: {
		translations: true;
	};
}>;

export function formatDish(dish: DishWithTranslations) {
	return {
		id: dish.id,
		name: dish.translations[0]?.name ?? null,
		description: dish.translations[0]?.description ?? null,
		originalName: dish.originalName,
		price: dish.price,
		allergens: dish.allergens,
	};
}
