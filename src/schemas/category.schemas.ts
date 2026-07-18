import z from "zod";

export const createCategorySchema = z.object({
	translations: z
		.array(
			z.object({
				locale: z.string().min(1, "El locale es obligatorio"),
				name: z.string().min(1, "El nombre traducido es obligatorio"),
			}),
		)
		.min(1, "Se requiere al menos una traducción"),
});

export const updateCategorySchema = createCategorySchema;
