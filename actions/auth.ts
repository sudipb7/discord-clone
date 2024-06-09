"use server";

import bcrypt from "bcryptjs";

import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/lib/queries";
import { sendEmailVerificationOtp } from "@/lib/mail";
import {
  SignInFormSchema,
  SignUpFormSchema,
  type SignInFormValues,
  type SignUpFormValues,
} from "@/schemas";
import { generateOTP } from "@/lib/utils";

export async function register(values: SignUpFormValues) {
  try {
    const validated = SignUpFormSchema.safeParse(values);
    if (!validated.success) {
      return { message: "Invalid form data" };
    }

    const { name, email, password } = validated.data;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { message: "Email already exists" };
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    const otp = await db.otp.create({
      data: {
        otp: generateOTP(),
        email,
        expires: new Date(Date.now() + 1000 * 60 * 5),
      },
    });

    await sendEmailVerificationOtp(email, otp.otp);

    return { message: "User Registered successfully", user };
  } catch (error) {
    console.log("REGISTER_ERROR", error);
    return null;
  }
}

export async function login(values: SignInFormValues) {
  try {
    const validated = SignInFormSchema.safeParse(values);
    if (!validated.success) {
      return { message: "Invalid form data" };
    }

    const { email, password } = validated.data;

    const user = await getUserByEmail(email);
    if (!user || !user.password) {
      return { message: "User not found" };
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { message: "Invalid password" };
    }

    if (!user.emailVerified) {
      const otp = await db.otp.create({
        data: {
          otp: generateOTP(),
          email,
          expires: new Date(Date.now() + 1000 * 60 * 5),
        },
      });

      await sendEmailVerificationOtp(email, otp.otp);

      return { message: "Please check your email" };
    }

    await signIn("credentials", { email, password });
  } catch (error) {
    console.log("LOGIN_ERROR", error);
    return null;
  }
}

export async function verifyEmail(email: string, otp: number) {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { message: "User not found" };
    }

    const findOtp = await db.otp.findFirst({
      where: {
        email,
        otp,
      },
    });
    if (!findOtp) {
      return { message: "Invalid OTP" };
    }

    if (findOtp.expires < new Date()) {
      await db.otp.delete({
        where: {
          id: findOtp.id,
        },
      });
      return { message: "OTP expired" };
    }

    if (findOtp.otp !== otp) {
      return { message: "Invalid OTP" };
    }

    await db.otp.delete({
      where: {
        id: findOtp.id,
      },
    });

    await db.user.update({
      where: { id: user.id, email },
      data: {
        emailVerified: new Date(),
      },
    });

    return { message: "Email verified successfully" };
  } catch (error) {
    console.log("VERIFY_EMAIL_ERROR", error);
    return null;
  }
}

export async function logout() {
  try {
    await signOut({ redirectTo: "/auth/signed-out" });
  } catch (error) {
    console.log("LOGOUT_ERROR", error);
    return null;
  }
}
