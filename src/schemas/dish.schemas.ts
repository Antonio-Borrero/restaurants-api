import z from "zod";

export const createDishSchema = z.object({
	price: z.number().positive("El precio debe ser un número positivo"),
	allergens: z
		.array(z.string().min(2, "Cada alérgeno debe tener al menos 2 caracteres"))
		.optional(),
	originalName: z
		.string()
		.min(2, "El nombre original debe tener al menos 2 caracteres")
		.optional(),
	translations: z
		.array(
			z.object({
				locale: z.string().min(2, "El locale debe tener al menos 2 caracteres"),
				name: z
					.string()
					.min(2, "El nombre traducido debe tener al menos 2 caracteres"),
				description: z.string().optional(),
			}),
		)
		.min(1, "Se requiere al menos una traducción"),
});

export const updateDishSchema = createDishSchema.partial();
