import { Router } from "express";
import {
	createCategoryController,
	deleteCategoryController,
	getCategoryController,
	updateCategoryController,
} from "../controllers/category.controllers.ts";
import { authenticate } from "../middlewares/authenticate.ts";
import { attachRestaurantIdFromCategory } from "../middlewares/attachRestaurantIdFromCategory.ts";
import { authorize } from "../middlewares/authorize.ts";

export const restaurantCategoryRouter = Router({ mergeParams: true });
restaurantCategoryRouter.post(
	"/",
	authenticate,
	authorize("MANAGE_MENU"),
	createCategoryController,
);

export const categoryRouter = Router();
categoryRouter.get("/:categoryId", getCategoryController);
categoryRouter.delete(
	"/:categoryId",
	authenticate,
	attachRestaurantIdFromCategory,
	authorize("MANAGE_MENU"),
	deleteCategoryController,
);
categoryRouter.patch(
	"/:categoryId",
	authenticate,
	attachRestaurantIdFromCategory,
	authorize("MANAGE_MENU"),
	updateCategoryController,
);
