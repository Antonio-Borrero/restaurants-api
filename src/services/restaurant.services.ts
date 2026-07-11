import { prisma } from "../lib/prisma.ts";

export async function createRestaurantService(name: string) {
	return await prisma.restaurant.create({
		data: {
			name,
		},
	});
}
export async function findRestaurantByIdService(id: number) {
	return await prisma.restaurant.findUnique({
		where: { id },
	});
}
