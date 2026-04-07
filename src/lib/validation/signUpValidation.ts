import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .min(10, "Phone number must be at least 10 digits"),
    country: z
      .string()
      .min(1, "Country is required")
      .min(2, "Country must be at least 2 characters"),
    image_url: z.string().optional(),
    role: z.enum(["user", "admin", "employee"]),
    accessKey: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "admin" || data.role === "employee") {
        return data.accessKey && data.accessKey.length > 0;
      }
      return true;
    },
    {
      path: ["accessKey"],
      message: "Access key is required for this account type",
    },
  );

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const validateAccessKey = (role: "admin" | "employee", accessKey: string): boolean => {
  const ACCESS_KEYS = {
    admin: process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY || "Admin12345",
    employee: process.env.NEXT_PUBLIC_EMPLOYEE_ACCESS_KEY || "employee12345",
  };
  return ACCESS_KEYS[role] === accessKey;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
