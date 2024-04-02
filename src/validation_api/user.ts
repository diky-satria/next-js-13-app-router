import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

export const addUserVal = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" })
      .refine(async (email) => {
        const data =
          await prisma.$queryRaw`select * from user where email = ${email}`;

        if (data.length > 0) {
          return false;
        } else {
          return true;
        }
      }, "Email is registered"),
    divisionId: z.string().min(1, { message: "Division is required" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(3, { message: "Password min 3 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Confirm Password is wrong",
    path: ["confirmPassword"],
  });

export const updateUserVal = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email_old: z
      .string()
      .min(1, { message: "Email Old is required" })
      .email({ message: "Invalid email address" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    divisionId: z.string().min(1, { message: "Division is required" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(3, { message: "Password min 3 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine(
    async (data) => {
      const user =
        await prisma.$queryRaw`select * from user where email = ${data.email}`;

      if (user.length > 0 && data.email !== data.email_old) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: "Email is registered",
      path: ["email"],
    }
  )
  .refine((data) => data.confirmPassword === data.password, {
    message: "Confirm Password is wrong",
    path: ["confirmPassword"],
  });
