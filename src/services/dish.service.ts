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
