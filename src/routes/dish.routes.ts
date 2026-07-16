import { Router } from "express";
import {
	createDishController,
	getDishController,
} from "../controllers/dish.controllers.ts";

export const categoryDishRouter = Router({ mergeParams: true });
categoryDishRouter.post("/", createDishController);

export const dishRouter = Router();
dishRouter.get("/:dishId", getDishController);
