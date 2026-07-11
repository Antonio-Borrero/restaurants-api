import { Router } from "express";
import { createRestaurantController } from "../controllers/restaurant.controllers.ts";

const restaurantRouter = Router();

restaurantRouter.post("/", createRestaurantController);

export default restaurantRouter;
