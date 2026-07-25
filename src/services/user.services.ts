import { prisma } from "../lib/prisma.ts";

export async function findUserByEmailService(email: string) {
	return await prisma.user.findUnique({
		where: {
			email,
		},
	});
}
