import { Router } from "express";
import {
	createRestaurantController,
	deleteRestaurantController,
	getRestaurantMenuController,
	updateRestaurantController,
} from "../controllers/restaurant.controllers.ts";

const restaurantRouter = Router();

restaurantRouter.post("/", createRestaurantController);
restaurantRouter.get("/:restaurantId/menu", getRestaurantMenuController);
restaurantRouter.delete("/:restaurantId", deleteRestaurantController);
restaurantRouter.patch("/:restaurantId", updateRestaurantController);

export default restaurantRouter;
