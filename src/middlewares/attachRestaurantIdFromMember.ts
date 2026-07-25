import type { NextFunction, Request, Response } from "express";
import { findMemberByIdService } from "../services/restaurantMember.service.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";

export async function attachRestaurantIdFromMember(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const memberId = Number(req.params.memberId);
	const member = await findMemberByIdService(memberId);

	if (!member) {
		throw new NotFoundError("MEMBER_NOT_FOUND", "Member not found");
	}

	req.params.restaurantId = String(member.restaurantId);
	next();
}
