import type { Prisma } from "../../generated/prisma/client.ts";

type CategoryWithTranslations = Prisma.CategoryGetPayload<{
	include: {
		translations: true;
	};
}>;

export function formatCategory(category: CategoryWithTranslations) {
	return {
		id: category.id,
		name: category.translations[0]?.name ?? null,
	};
}
