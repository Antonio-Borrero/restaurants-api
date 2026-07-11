import { Router } from "express";
import { createCategoryController } from "../controllers/category.controllers.ts";

const categoryRouter = Router({ mergeParams: true });

categoryRouter.post("/", createCategoryController);

export default categoryRouter;
