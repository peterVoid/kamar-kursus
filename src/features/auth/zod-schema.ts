import z from "zod";

export const loginSchema = z.object({
  email: z.email().min(1, "Email is required"),
});

export type loginInferSchema = z.infer<typeof loginSchema>;
