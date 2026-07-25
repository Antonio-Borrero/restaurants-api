import { findUserByEmailService } from "./user.services.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";
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

export async function inviteMemberService(
	restaurantId: number,
	email: string,
	role: string,
) {
	const user = await findUserByEmailService(email);

	if (!user) {
		throw new NotFoundError("USER_NOT_FOUND", "User not found");
	}

	return await prisma.restaurantMember.create({
		data: {
			restaurantId,
			userId: user.id,
			role,
			permissions: [],
		},
	});
}

export async function updatePermissionsService(
	memberId: number,
	permissions: string[],
) {
	return await prisma.restaurantMember.update({
		where: { id: memberId },
		data: {
			permissions,
		},
	});
}

export async function removeMemberService(memberId: number) {
	return await prisma.restaurantMember.delete({
		where: { id: memberId },
	});
}

export async function findMemberByIdService(memberId: number) {
	return await prisma.restaurantMember.findUnique({
		where: { id: memberId },
	});
}
