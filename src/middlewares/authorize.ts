import type { Request, Response, NextFunction } from "express";
import { checkMembershipService } from "../services/restaurantMember.service.ts";
import { ForbiddenError } from "../errors/ForbiddenError.ts";

export function authorize(permission: string) {
	return async function (req: Request, res: Response, next: NextFunction) {
		const userId = req.userId!;
		const restaurantId = Number(req.params.restaurantId);

		const membership = await checkMembershipService(userId, restaurantId);

		if (!membership) {
			throw new ForbiddenError(
				"NOT_A_MEMBER",
				"You do not have permission to this restaurant",
			);
		}

		if (!membership.permissions.includes(permission)) {
			throw new ForbiddenError(
				"INSUFFICIENT_PERMISSIONS",
				"You do not have this permission",
			);
		}

		next();
	};
}
