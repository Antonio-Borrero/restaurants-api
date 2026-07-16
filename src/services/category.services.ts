import { prisma } from "../lib/prisma.ts";

export async function createCategoryService(
	restaurantId: number,
	translations: { locale: string; name: string }[],
) {
	return await prisma.category.create({
		data: {
			restaurantId,
			translations: {
				create: translations,
			},
		},
		include: { translations: true },
	});
}

export async function findCategoryByIdService(categoryId: number) {
	return await prisma.category.findUnique({
		where: { id: categoryId },
	});
}

export async function getCategoryService(categoryId: number, locale: string) {
	return await prisma.category.findUnique({
		where: { id: categoryId },
		include: {
			translations: {
				where: { locale },
			},
		},
	});
}
