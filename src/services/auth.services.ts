import * as argon2 from "argon2";
import { prisma } from "../lib/prisma.ts";
import { UnauthorizedError } from "../errors/UnauthorizedError.ts";
import jwt from "jsonwebtoken";

export async function registerService(email: string, password: string) {
	const passwordHash = await argon2.hash(password);

	return await prisma.user.create({
		data: {
			email,
			passwordHash,
		},
		select: { id: true, email: true, createdAt: true, updatedAt: true },
	});
}

export async function loginService(email: string, password: string) {
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!user) {
		throw new UnauthorizedError("INVALID_CREDENTIALS", "Invalid credentials");
	}

	const verifiedPassword = await argon2.verify(user.passwordHash, password);

	if (!verifiedPassword) {
		throw new UnauthorizedError("INVALID_CREDENTIALS", "Invalid credentials");
	}

	const token = jwt.sign(
		{
			userId: user.id,
		},
		process.env.JWT_SECRET!,
		{ expiresIn: "1h" },
	);

	const { passwordHash: _, ...userWithoutHash } = user;

	return { user: userWithoutHash, token };
}
