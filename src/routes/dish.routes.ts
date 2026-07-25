import { Router } from "express";
import {
	createDishController,
	deleteDishController,
	getDishController,
	updateDishController,
} from "../controllers/dish.controllers.ts";
import { authenticate } from "../middlewares/authenticate.ts";
import { attachRestaurantIdFromCategory } from "../middlewares/attachRestaurantIdFromCategory.ts";
import { attachRestaurantIdFromDish } from "../middlewares/attachRestaurantIdFromDish.ts";
import { authorize } from "../middlewares/authorize.ts";

export const categoryDishRouter = Router({ mergeParams: true });
categoryDishRouter.post(
	"/",
	authenticate,
	attachRestaurantIdFromCategory,
	authorize("MANAGE_MENU"),
	createDishController,
);

export const dishRouter = Router();
dishRouter.get("/:dishId", getDishController);
dishRouter.delete(
	"/:dishId",
	authenticate,
	attachRestaurantIdFromDish,
	authorize("MANAGE_MENU"),
	deleteDishController,
);
dishRouter.patch(
	"/:dishId",
	authenticate,
	attachRestaurantIdFromDish,
	authorize("MANAGE_MENU"),
	updateDishController,
);
