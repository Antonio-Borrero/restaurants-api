import z from "zod";

export const registerSchema = z.object({
	email: z.email("Email not valid"),
	password: z.string().min(8, "Password should have at least 8 characters"),
});

export const loginSchema = z.object({
	email: z.email(),
	password: z.string(),
});
