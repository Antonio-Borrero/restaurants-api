import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.ts";
import { authorize } from "../middlewares/authorize.ts";
import {
	inviteMemberController,
	removeMemberController,
	updatePermissionsController,
} from "../controllers/restaurantMember.controllers.ts";
import { attachRestaurantIdFromMember } from "../middlewares/attachRestaurantIdFromMember.ts";

export const restaurantMemberRouter = Router({ mergeParams: true });
restaurantMemberRouter.post(
	"/",
	authenticate,
	authorize("MANAGE_MEMBERS"),
	inviteMemberController,
);

export const memberRouter = Router();
memberRouter.patch(
	"/:memberId/permissions",
	authenticate,
	attachRestaurantIdFromMember,
	authorize("MANAGE_PERMISSIONS"),
	updatePermissionsController,
);
memberRouter.delete(
	"/:memberId",
	authenticate,
	attachRestaurantIdFromMember,
	authorize("MANAGE_MEMBERS"),
	removeMemberController,
);
