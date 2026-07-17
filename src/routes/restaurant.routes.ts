import { Router } from "express";
import {
	createRestaurantController,
	deleteRestaurantController,
	getRestaurantMenuController,
} from "../controllers/restaurant.controllers.ts";

const restaurantRouter = Router();

restaurantRouter.post("/", createRestaurantController);
restaurantRouter.get("/:restaurantId/menu", getRestaurantMenuController);
restaurantRouter.delete("/:restaurantId", deleteRestaurantController);

export default restaurantRouter;
