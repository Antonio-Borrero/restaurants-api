import type { Request, Response } from "express";
import {
	inviteMembersSchema,
	updatePermissionsSchema,
} from "../schemas/restaurantMember.schemas.ts";
import {
	findMemberByIdService,
	inviteMemberService,
	removeMemberService,
	updatePermissionsService,
} from "../services/restaurantMember.service.ts";
import { NotFoundError } from "../errors/NotFoundError.ts";

export async function inviteMemberController(req: Request, res: Response) {
	const restaurantId = Number(req.params.restaurantId);
	const { email, role } = inviteMembersSchema.parse(req.body);

	const restaurantMember = await inviteMemberService(restaurantId, email, role);
	res.status(201).json(restaurantMember);
}

export async function updatePermissionsController(req: Request, res: Response) {
	const memberId = Number(req.params.memberId);
	const { permissions } = updatePermissionsSchema.parse(req.body);

	const member = await findMemberByIdService(memberId);

	if (!member) {
		throw new NotFoundError("MEMBER_NOT_FOUND", "Member not found");
	}

	const updatedPermissions = await updatePermissionsService(
		memberId,
		permissions,
	);
	res.status(200).json(updatedPermissions);
}

export async function removeMemberController(req: Request, res: Response) {
	const memberId = Number(req.params.memberId);

	const member = await findMemberByIdService(memberId);

	if (!member) {
		throw new NotFoundError("MEMBER_NOT_FOUND", "Member not found");
	}

	await removeMemberService(memberId);
	res.status(204).send();
}
