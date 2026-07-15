import z from "zod";

export const createRestaurantSchema = z.object({
	name: z.string().min(1, "El nombre del restaurante es obligatorio"),
});

export const getMenuQuerySchema = z.object({
	locale: z
		.string({ error: "El parámetro 'locale' es obligatorio" })
		.min(1, "El parámetro 'locale' no puede estar vacío"),
});
