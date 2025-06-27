import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(2, "Password must be at least 6 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
