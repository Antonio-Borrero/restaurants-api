import { Router } from "express";
import { createDishController } from "../controllers/dish.controllers.ts";

const dishRouter = Router({ mergeParams: true });
dishRouter.post("/", createDishController);

export default dishRouter;
