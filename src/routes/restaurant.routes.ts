import { Router } from "express";
import {
	createRestaurantController,
	deleteRestaurantController,
	getRestaurantMenuController,
	updateRestaurantController,
} from "../controllers/restaurant.controllers.ts";
import { authenticate } from "../middlewares/authenticate.ts";
import { authorize } from "../middlewares/authorize.ts";

const restaurantRouter = Router();

restaurantRouter.post("/", authenticate, createRestaurantController);
restaurantRouter.get("/:restaurantId/menu", getRestaurantMenuController);
restaurantRouter.delete(
	"/:restaurantId",
	authenticate,
	authorize("DELETE_RESTAURANT"),
	deleteRestaurantController,
);
restaurantRouter.patch(
	"/:restaurantId",
	authenticate,
	authorize("EDIT_RESTAURANT"),
	updateRestaurantController,
);

export default restaurantRouter;
