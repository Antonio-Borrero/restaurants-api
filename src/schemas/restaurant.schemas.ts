import z from "zod";

export const createRestaurantSchema = z.object({
	name: z.string().min(1, "El nombre del restaurante es obligatorio"),
	address: z.string().optional(),
	telephone: z.string().optional(),
	email: z.email().optional(),
	cuisineType: z.string().optional(),
	description: z.string().optional(),
	imageUrl: z.string().optional(),
});

export const getMenuQuerySchema = z.object({
	locale: z
		.string({ error: "El parámetro 'locale' es obligatorio" })
		.min(1, "El parámetro 'locale' no puede estar vacío"),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();
