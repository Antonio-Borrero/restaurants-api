import { Router } from "express";
import {
	createCategoryController,
	deleteCategoryController,
	getCategoryController,
	updateCategoryController,
} from "../controllers/category.controllers.ts";

export const restaurantCategoryRouter = Router({ mergeParams: true });
restaurantCategoryRouter.post("/", createCategoryController);

export const categoryRouter = Router();
categoryRouter.get("/:categoryId", getCategoryController);
categoryRouter.delete("/:categoryId", deleteCategoryController);
categoryRouter.patch("/:categoryId", updateCategoryController);
