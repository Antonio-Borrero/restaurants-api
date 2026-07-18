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

export async function deleteCategoryService(categoryId: number) {
	return await prisma.category.delete({
		where: { id: categoryId },
	});
}

export async function countCategoriesByRestaurantService(restaurantId: number) {
	return await prisma.category.count({
		where: { restaurantId },
	});
}

export async function updateCategoryService(
	categoryId: number,
	translations: { locale: string; name: string }[],
) {
	return await prisma.category.update({
		where: { id: categoryId },
		data: {
			translations: {
				upsert: translations.map((translation) => ({
					where: {
						categoryId_locale: { categoryId, locale: translation.locale },
					},
					update: { name: translation.name },
					create: { locale: translation.locale, name: translation.name },
				})),
			},
		},
	});
}
