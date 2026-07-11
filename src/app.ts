import express from "express";
import { prisma } from "./lib/prisma.ts";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
	res.json({ mensaje: "API funcionando" });
});

app.post("/restaurants", async (req, res) => {
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
		const newRestaurant = await prisma.restaurant.create({
			data: {
				name,
			},
		});
		res.status(201).json(newRestaurant);
	} catch (error) {
		res.status(500).json({ error: "Error al crear el restaurante" });
	}
});

export default app;
