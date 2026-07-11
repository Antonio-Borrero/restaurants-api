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
