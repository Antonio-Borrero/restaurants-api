import z from "zod";

export const inviteMembersSchema = z.object({
	email: z.email("Email not valid"),
	role: z.string().min(3, "Role has to be at least 3 characters long"),
});

export const updatePermissionsSchema = z.object({
	permissions: z.array(
		z.enum([
			"MANAGE_MENU",
			"EDIT_RESTAURANT",
			"DELETE_RESTAURANT",
			"MANAGE_MEMBERS",
			"MANAGE_PERMISSIONS",
		]),
	),
});
