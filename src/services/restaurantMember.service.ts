import { prisma } from "../lib/prisma.ts";

export async function checkMembershipService(
	userId: number,
	restaurantId: number,
) {
	return await prisma.restaurantMember.findUnique({
		where: {
			userId_restaurantId: { userId, restaurantId },
		},
	});
}
