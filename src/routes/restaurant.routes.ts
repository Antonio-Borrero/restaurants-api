import { Router } from "express";
import {
	createRestaurantController,
	getRestaurantMenuController,
} from "../controllers/restaurant.controllers.ts";

const restaurantRouter = Router();

restaurantRouter.post("/", createRestaurantController);
restaurantRouter.get("/:restaurantId/menu", getRestaurantMenuController);

export default restaurantRouter;
