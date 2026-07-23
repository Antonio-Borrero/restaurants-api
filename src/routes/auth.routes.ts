import { Router } from "express";
import {
	loginController,
	registerController,
} from "../controllers/auth.controllers.ts";

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
