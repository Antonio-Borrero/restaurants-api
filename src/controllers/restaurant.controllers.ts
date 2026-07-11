import type { Request, Response } from "express";
import { createRestaurantService } from "../services/restaurant.services.ts";

export async function createRestaurantController(req: Request, res: Response) {
	const { name } = req.body;
	if (!name) {
		return res.status(400).json({ error: "Faltan datos obligatorios" });
	}
	if (typeof name !== "string") {
		return res
			.status(400)
			.json({ error: "Los datos deben ser de tipo string" });
	}
	try {
		const newRestaurant = await createRestaurantService(name);
		res.status(201).json(newRestaurant);
	} catch (error) {
		res.status(500).json({ error: "Error al crear el restaurante" });
	}
}
