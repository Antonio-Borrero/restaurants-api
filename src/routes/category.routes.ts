import { Router } from "express";
import {
	createCategoryController,
	getCategoryController,
} from "../controllers/category.controllers.ts";

export const restaurantCategoryRouter = Router({ mergeParams: true });
restaurantCategoryRouter.post("/", createCategoryController);

export const categoryRouter = Router();
categoryRouter.get("/:categoryId", getCategoryController);
