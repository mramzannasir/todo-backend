import { z } from "zod";
const nameRegex = /^[A-Za-z\s]+$/;
export const userSchemaValidation = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters long")
        .max(10, "Name must be at most 10 characters long")
        .regex(nameRegex, "Name can only contain alphabetic characters and spaces"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password is to Short"),
});
export const loginValidationSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password is to Short"),
});
