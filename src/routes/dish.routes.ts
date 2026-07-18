import { Router } from "express";
import {
	createDishController,
	deleteDishController,
	getDishController,
	updateDishController,
} from "../controllers/dish.controllers.ts";

export const categoryDishRouter = Router({ mergeParams: true });
categoryDishRouter.post("/", createDishController);

export const dishRouter = Router();
dishRouter.get("/:dishId", getDishController);
dishRouter.delete("/:dishId", deleteDishController);
dishRouter.patch("/:dishId", updateDishController);
